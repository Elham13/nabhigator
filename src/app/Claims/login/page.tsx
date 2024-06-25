"use client";

import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { ChangeEvent, FocusEvent, useState } from "react";
import Header from "./components/Header";
import { showError } from "@/lib/helpers";

const Login = () => {
  const router = useRouter();
  const [values, setValues] = useState({ userId: "", password: "" });
  const [errors, setErrors] = useState({
    userId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [_, setUser] = useLocalStorage<IUserFromSession | null>({
    key: StorageKeys.USER,
    defaultValue: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!value)
      setErrors((prev) => ({
        ...prev,
        [name]: `Please enter ${name}`,
      }));
    else
      setErrors((prev) => ({
        ...prev,
        [name]: ``,
      }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (Object.values(errors)?.some((value) => value !== "")) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post<SingleResponseType<IUserFromSession>>(
        EndPoints.USER_LOGIN,
        values
      );
      setUser(data.data);

      if (data?.data && data?.data?.role?.length > 1) {
        router.replace("/Claims/dashboard/selectRole");
      } else if (data?.data && data?.data?.role?.length === 1) {
        router.replace("/Claims/dashboard");
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper h="100vh">
      <Head>
        <title>Nabhigator Login</title>
        <meta name="description" content="Welcome to Nabhigator Login" />
      </Head>
      <Header />
      <Container size={420} my={40}>
        <Title ta="center">Welcome back!</Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor size="sm" component="button">
            Ask the admin to create one
          </Anchor>
        </Text>

        <form onSubmit={handleSubmit}>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              label="User Id"
              placeholder="Pxxxxx"
              required
              error={errors.userId}
              name="userId"
              value={values.userId}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              error={errors.password}
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Button loading={loading} type="submit" fullWidth mt="xl">
              Sign inn
            </Button>
          </Paper>
        </form>
      </Container>
    </Paper>
  );
};

export default Login;
