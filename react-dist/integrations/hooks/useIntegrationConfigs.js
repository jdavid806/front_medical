import { useEffect, useState } from "react";
export const useIntegrationConfigs = () => {
  const [configs, setConfigs] = useState([]);
  const fetchConfigs = async () => {
    setConfigs([{
      key: "LABPLUS_URL",
      value: "https://google.com"
    }, {
      key: "LABPLUS_TOKEN",
      value: "123456"
    }, {
      key: "DGII_FILE",
      value: "https://plus.unsplash.com/premium_photo-1661892088256-0a17130b3d0d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVycml0b3xlbnwwfHwwfHx8MA%3D%3D"
    }, {
      key: "DGII_PASSWORD",
      value: "123456"
    }, {
      key: "DGII_USERS",
      value: "1,2,3"
    }, {
      key: "DGII_TENANTS",
      value: "DGII_1"
    }]);
  };
  useEffect(() => {
    fetchConfigs();
  }, []);
  return {
    configs,
    fetchConfigs
  };
};