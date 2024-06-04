import React from "react";
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";

const styles = StyleSheet.create({
  container: { display: "flex", padding: 100 },
  logo: {
    width: 140,
    alignSelf: "flex-end",
  },
  textBold: {
    fontWeight: 800,
    fontSize: 20,
    lineHeight: 1.5,
  },
  textNormal: {
    fontSize: 20,
    lineHeight: 1.5,
  },
  horizontalContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  signature: {
    width: 200,
  },
});

type PropTypes = {
  dashboardData: IDashboardData | null;
};

const AuthorizationLetter = ({ dashboardData }: PropTypes) => {
  return (
    <View style={styles.container}>
      <Image src="/images/nivaBupaLogo.png" style={styles.logo} />
      <View style={[styles.horizontalContainer, { marginTop: 20 }]}>
        <Text style={[styles.textBold, { marginBottom: 10 }]}>To</Text>
        <Text style={[styles.textBold, { marginBottom: 10 }]}>
          Date: {dayjs().format("DD-MMM-YYYY")}
        </Text>
      </View>
      <Text style={[styles.textBold, { marginBottom: 10 }]}>
        The MRD Department,
      </Text>
      <Text style={[styles.textBold, { marginBottom: 10 }]}>
        {dashboardData?.hospitalDetails?.providerName}
      </Text>
      <Text style={[styles.textBold, { marginBottom: 10 }]}>
        {dashboardData?.hospitalDetails?.providerAddress}
      </Text>
      <Text style={[styles.textBold, { marginBottom: 10 }]}>
        {`${dashboardData?.hospitalDetails?.providerCity}, ${dashboardData?.hospitalDetails?.providerState}, ${dashboardData?.hospitalDetails?.pinCode}`}
      </Text>
      <Text style={[styles.textBold, { marginVertical: 20 }]}>
        Subject: Request for facilitation of necessary information and medical
        records including indoor cases papers of{" "}
        {dashboardData?.insuredDetails?.insuredName}, Date of Admission{" "}
        {dayjs(dashboardData?.hospitalizationDetails?.dateOfAdmission).format(
          "DD-MMM-YYYY"
        )}
        .
      </Text>
      <Text style={[styles.textNormal, { marginVertical: 20 }]}>
        Dear Sir/Madam,
      </Text>
      <Text style={[styles.textNormal, { marginVertical: 20 }]}>
        Greetings from Niva Bupa Health Insurance Company Ltd. (Formerly known
        as Max Bupa Health Insurance Company Limited)
      </Text>
      <Text style={[styles.textNormal, { marginVertical: 20 }]}>
        This is in reference to receipt of insurance claim bearing claim number{" "}
        {dashboardData?.claimId}, from one of our customer{" "}
        {dashboardData?.insuredDetails?.insuredName} who is insured with us.
        Insured have claimed to be hospitalized/treated in your esteemed
        institute/clinic from Date of Admission/consultation/treatment{" "}
        {dayjs(dashboardData?.hospitalizationDetails?.dateOfAdmission).format(
          "DD-MMM-YYYY"
        )}
        .
      </Text>
      <Text style={[styles.textNormal, { marginVertical: 20 }]}>
        In order to process the claim, request your kind support by facilitating
        the requisite information including certified copy of medical records,
        indoor case papers, Discharge Summary, Final Bill , Pre-Anesthesia Notes
        (If any), OT Notes (if any), OPD consultation papers (if any), OPD/IPD
        records (If any), Treating Doctor/Surgeon/Anesthetist confirmation (if
        any required).
      </Text>
      <Text style={[styles.textNormal, { marginVertical: 20 }]}>
        <Text style={styles.textBold}>
          {dashboardData?.claimInvestigators &&
          dashboardData?.claimInvestigators?.length > 0
            ? dashboardData?.claimInvestigators
                ?.map((el) => el?.name)
                ?.join(", ")
            : "-"}
        </Text>{" "}
        is our authorized service provider and has been authorized to collect
        the requested information and documents from you on our behalf.
      </Text>
      <Text style={[styles.textNormal, { marginVertical: 20 }]}>
        Looking forward to your kind co-operation, support and necessary
        facilitation as requested
      </Text>
      <Text style={[styles.textNormal, { marginTop: 20 }]}>Thank You,</Text>
      <Text style={styles.textNormal}>Warm Regards,</Text>
      <Text style={[styles.textBold, { marginTop: 20 }]}>
        For and on behalf of
      </Text>
      <Text style={styles.textBold}>
        Niva Bupa Health Insurance Company Limited
      </Text>
      <Text style={[styles.textBold, { fontStyle: "italic" }]}>
        (Formerly known as Max Bupa Health Insurance Co. Ltd.)
      </Text>
      <Image src="/aem-to-react/signature.jpg" style={styles.signature} />
      <Text style={[styles.textBold, { marginTop: 20 }]}>Manish Baweja</Text>
      <Text style={[styles.textBold, { marginVertical: 20, fontSize: 16 }]}>
        (Vice President - Fraud & Risk Control Unit, Insttutonal Fraud Risk
        Control Unit) Niva Bupa Health Insurance Co. Ltd.{" "}
      </Text>
      <Text style={[styles.textNormal, { fontStyle: "italic" }]}>
        (Formerly known as Max Bupa Health Insurance Co. Ltd.)
      </Text>
      <Text style={styles.textNormal}>
        Logix Infotech Park, Plot no D-5, Sector 59, Noida,
      </Text>
      <Text style={styles.textNormal}>
        Gautam Budh Nagar, Uttar Pradesh 201301
      </Text>
      <Text style={[styles.textNormal, { fontSize: 16 }]}>
        This is a system generated letter hence consider as original letter.
      </Text>
    </View>
  );
};

export default AuthorizationLetter;
