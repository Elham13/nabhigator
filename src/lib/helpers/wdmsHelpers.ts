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

  if (process.env.CONFIG) {
    if (["LOCAL", "UAT"].includes(process.env.CONFIG)) {
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
