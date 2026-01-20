import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  HddOutlined,
  LoadingOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { login, register } from "@soundx/services";
import {
  AutoComplete,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Typography,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { useMessage } from "../../context/MessageContext";
import { useAuthStore } from "../../store/auth";
import styles from "./index.module.less";

const { Title, Text } = Typography;

const LoginModal: React.FC = () => {
  const message = useMessage();
  const { token, login: setLogin } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [serverHistory, setServerHistory] = useState<{ value: string }[]>([]);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginForm] = Form.useForm();
  const { token: themeToken } = theme.useToken();

  const [serverStatus, setServerStatus] = useState<
    "success" | "error" | "validating" | null
  >(null);

  // Load saved history and credentials on mount
  useEffect(() => {
    const history = localStorage.getItem("serverHistory");
    if (history) {
      setServerHistory(JSON.parse(history));
    } else {
      setServerHistory([{ value: "http://localhost:3000" }]);
    }

    const savedAddress = localStorage.getItem("serverAddress");
    if (savedAddress) {
      loginForm.setFieldsValue({ serverAddress: savedAddress });
      checkServerConnectivity(savedAddress);
      restoreCredentials(savedAddress);
    }
  }, [loginForm]);

  const restoreCredentials = (address: string) => {
    const credsKey = `creds_${address}`;
    const savedCreds = localStorage.getItem(credsKey);
    if (savedCreds) {
      const { username, password } = JSON.parse(savedCreds);
      loginForm.setFieldsValue({ username, password });
      setRememberMe(true);
    } else {
      loginForm.setFieldsValue({ username: "", password: "" });
      setRememberMe(false);
    }
  };

  const saveToHistory = (address: string) => {
    if (!address) return;
    const history = localStorage.getItem("serverHistory");
    let list = history ? JSON.parse(history) : [];
    if (!list.find((i: any) => i.value === address)) {
      list.push({ value: address });
      localStorage.setItem("serverHistory", JSON.stringify(list));
      setServerHistory(list);
    }
  };

  const checkServerConnectivity = async (address: string) => {
    if (!address) return;
    if (!address.startsWith("http://") && !address.startsWith("https://"))
      return;

    setServerStatus("validating");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

      const response = await fetch(
        `${address.endsWith("/") ? address : address + "/"}hello`,
        {
          signal: controller.signal,
        },
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const text = await response.text();
        if (text.includes("hello")) {
          setServerStatus("success");
          message.success("后端服务已连接");
          return;
        }
      }
      throw new Error("Invalid response");
    } catch (error) {
      console.error("Connectivity check failed:", error);
      setServerStatus("error");
      message.error("后端服务连接失败，请检查地址是否正确");
    }
  };

  const handleFinish = async (values: any) => {
    setLoading(true);
    localStorage.setItem("serverAddress", values.serverAddress);
    saveToHistory(values.serverAddress);

    const baseURL = values.serverAddress;
    const tokenKey = `token_${baseURL}`;
    const userKey = `user_${baseURL}`;
    const deviceKey = `device_${baseURL}`;
    const credsKey = `creds_${baseURL}`;

    try {
      if (isLogin) {
        const res = await login({
          username: values.username,
          password: values.password,
        });
        if (res.data) {
          const { token: newToken, device, ...userData } = res.data;

          localStorage.setItem(tokenKey, newToken);
          localStorage.setItem(userKey, JSON.stringify(userData));
          if (device) localStorage.setItem(deviceKey, JSON.stringify(device));

          if (rememberMe) {
            localStorage.setItem(
              credsKey,
              JSON.stringify({
                username: values.username,
                password: values.password,
              }),
            );
          } else {
            localStorage.removeItem(credsKey);
          }

          setLogin(newToken, userData as any, device);
          message.success("登录成功");
        }
      } else {
        const res = await register({
          username: values.username,
          password: values.password,
        });
        if (res.data) {
          const { token: newToken, device, ...userData } = res.data;

          localStorage.setItem(tokenKey, newToken);
          localStorage.setItem(userKey, JSON.stringify(userData));
          if (device) localStorage.setItem(deviceKey, JSON.stringify(device));

          setLogin(newToken, userData as any, device);
          message.success("注册成功");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <Modal
      open={!token}
      footer={null}
      closable={false}
      maskClosable={false}
      mask={false}
      centered
      width={420}
      className={styles.loginModal}
    >
      <div className={styles.header}>
        <Title
          level={2}
          className={styles.title}
          style={{ color: themeToken.colorText }}
        >
          {isLogin ? "Login" : "Sign Up"}
        </Title>
        <Text
          className={styles.subtitle}
          style={{ color: themeToken.colorTextSecondary }}
        >
          {isLogin ? "欢迎回来" : "创建一个新账户开始"}
        </Text>
      </div>

      <Form
        form={loginForm}
        layout="vertical"
        size="large"
        className={styles.form}
      >
        <Form.Item
          name="serverAddress"
          validateStatus={
            serverStatus === "error"
              ? "error"
              : serverStatus === "success"
                ? "success"
                : serverStatus === "validating"
                  ? "validating"
                  : ""
          }
          // hasFeedback
          rules={[
            { required: true, message: "请输入服务端地址" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (
                  value.startsWith("http://") ||
                  value.startsWith("https://")
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("服务端地址必须以 http:// 或 https:// 开头"),
                );
              },
            },
          ]}
        >
          <AutoComplete
            options={serverHistory}
            onSelect={(val) => {
              checkServerConnectivity(val);
              restoreCredentials(val);
            }}
            onChange={(val) => {
              if (val.startsWith("http")) {
                restoreCredentials(val);
              }
            }}
          >
            <Input
              prefix={<HddOutlined />}
              placeholder="请输入服务端地址"
              onBlur={(e) => checkServerConnectivity(e.target.value)}
              suffix={
                serverStatus === "error" ? (
                  <CloseCircleOutlined />
                ) : serverStatus === "success" ? (
                  <CheckCircleOutlined />
                ) : serverStatus === "validating" ? (
                  <LoadingOutlined />
                ) : null
              }
            />
          </AutoComplete>
        </Form.Item>
        {isLogin ? (
          <>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "请输入用户名!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入密码!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 16 }}>
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ color: themeToken.colorTextSecondary }}
              >
                记住我
              </Checkbox>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                onClick={async () => {
                  const values = await loginForm.validateFields();
                  handleFinish(values);
                }}
                block
                loading={loading}
                className={styles.submitButton}
              >
                登录
              </Button>
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "请输入用户名!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="User Name" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入密码!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="confirm"
              dependencies={["password"]}
              rules={[
                { required: true, message: "请确认密码!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不一致!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                onClick={async () => {
                  const values = await loginForm.validateFields();
                  handleFinish(values);
                }}
                block
                loading={loading}
                className={styles.submitButton}
              >
                注册并登录
              </Button>
            </Form.Item>
          </>
        )}
      </Form>

      <div
        className={styles.switchText}
        style={{ color: themeToken.colorTextSecondary }}
      >
        {isLogin ? (
          <>
            没有账号？
            <span
              className={styles.switchLink}
              onClick={() => setIsLogin(false)}
              style={{ color: themeToken.colorPrimary }}
            >
              注册
            </span>
          </>
        ) : (
          <>
            已有账号？
            <span
              className={styles.switchLink}
              onClick={() => setIsLogin(true)}
              style={{ color: themeToken.colorPrimary }}
            >
              登陆
            </span>
          </>
        )}
      </div>

      <div
        className={styles.footer}
        style={{ color: themeToken.colorTextTertiary }}
      >
        Created by AudioDock
      </div>
    </Modal>
  );
};

export default LoginModal;
