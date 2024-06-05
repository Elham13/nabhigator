export const buildWDMSUrl = () => {
  type MainObjType = {
    docDetail: {
      baseUrl: string;
      clientId: string;
      clientSecret: string;
      source: string;
      caseTypeID: string;
      userName: string;
      password: string;
    };
    docContent: {
      baseUrl: string;
      clientId: string;
      clientSecret: string;
      source: string;
      caseTypeID: string;
      userName: string;
      password: string;
    };
  };

  let mainObj: MainObjType = {
    docDetail: {
      baseUrl: "",
      clientId: "",
      clientSecret: "",
      source: "",
      caseTypeID: "",
      userName: "",
      password: "",
    },
    docContent: {
      baseUrl: "",
      clientId: "",
      clientSecret: "",
      source: "",
      caseTypeID: "",
      userName: "",
      password: "",
    },
  };

  if (process.env.NEXT_PUBLIC_CONFIG) {
    if (["LOCAL", "UAT"].includes(process.env.NEXT_PUBLIC_CONFIG)) {
      mainObj = {
        docDetail: {
          baseUrl: "http://172.23.115.56:9087/",
          clientId: "28adseghjgdsjmarchdwdwidj1jh9hjh9hj9hj6",
          clientSecret: "ID1N4O1V1A19P9I5Document",
          source: "WebSite",
          caseTypeID: "",
          userName: "NivaBupa_GenericAPI_DocService",
          password: "=OnN!V7$$J&Dh*FYENF#$`Doc%^==",
        },
        docContent: {
          baseUrl: "http://172.23.115.56:8086/",
          clientId: "ad32321sadscqweq1212wdanbasjjxjscbznxc",
          clientSecret: "14W13D12M11S10APIDocument",
          userName: "NivaBupa_PWCDocumentUser",
          password: "N!bPwC#!^75)9*(&^%%$202^&%*~Doc",
          source: "",
          caseTypeID: "",
        },
      };
    } else {
      mainObj = {
        docDetail: {
          baseUrl: "http://172.23.136.69:9087/",
          clientId: "28adseghjgdsjmarchdwdwidj1jh9hjh9hj9hj6",
          clientSecret: "ID1N4O1V1A19P9I5Document",
          source: "WebSite",
          caseTypeID: "HCP-00000000000216-MB",
          userName: "Website_GenericAPI_DocService",
          password: "=OnN!V7$$J&Dh*FYENF#$`Doc%^==",
        },
        docContent: {
          baseUrl: "http://172.23.136.68:8086/",
          clientId: "28adseghjgdsjmarchdwdwidj1jh9hjh9hj9hj6",
          clientSecret: "ID1N4O1V1A19P9I5Document",
          source: "",
          caseTypeID: "",
          userName: "NivaBupa_WebsiteDocumentUser",
          password: "N!b@bpa$D%0(N^#*!~Doc",
        },
      };
    }
  }

  return mainObj;
};

export const buildMaximusUrl = () => {
  type MainObjType = {
    baseUrl: string;
    authPayload: {
      UserID: string;
      Client_id: string;
    };
    apiId: string;
  };

  let mainObj: MainObjType = {
    baseUrl: "",
    authPayload: { UserID: "", Client_id: "" },
    apiId: "",
  };

  if (process.env.NEXT_PUBLIC_CONFIG) {
    if (["LOCAL", "UAT"].includes(process.env.NEXT_PUBLIC_CONFIG)) {
      mainObj = {
        baseUrl: "https://caseuat.nivabupa.com/uat/api/",
        authPayload: {
          UserID: "fniWorkflow",
          Client_id:
            "7c59fa9b9c2dea047995f6cf91bd6f1ba00fc410f387d18bcac678ea9e18c2e7",
        },
        apiId: "a69kp43tn7",
      };
    } else {
      mainObj = {
        baseUrl: "https://case.nivabupa.com/prod/api/",
        authPayload: {
          UserID: "fniWorkflow",
          Client_id:
            "23c05746eafc5b672674169d0611386fe9a25ea53f6f6cd407a0718bdfa16ab9",
        },
        apiId: "4krb3qc8rf",
      };
    }
  }

  return mainObj;
};
