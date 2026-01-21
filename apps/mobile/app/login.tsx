import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { check } from "@soundx/services";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNativeAdapter } from "../../../packages/services/src/adapter/manager";
import { useAuth } from "../src/context/AuthContext";
import { useTheme } from "../src/context/ThemeContext";

export default function LoginScreen() {
  const { colors } = useTheme();
  const { login, register } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [serverAddress, setServerAddress] = useState("http://localhost:3000");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<"ok" | "error">("error");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Local Server", value: "http://localhost:3000" },
  ]);

  useEffect(() => {
    loadServerAddress();
  }, []);

  const checkServerConnectivity = async (address: string) => {
    if (!address) {
      setStatusMessage("error");
      return;
    }

    // Simple URL validation
    if (!address.startsWith("http://") && !address.startsWith("https://")) {
      setStatusMessage("error");
      return;
    }

    try {
      // Configure adapter securely with just URL first to test connectivity
      // Note: Subsonic ping usually requires auth, so this might fail validation but succeed in network
      // For now we assume if we are typing a URL, we want to try Subsonic logic if configured
      useNativeAdapter();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await check();
      clearTimeout(timeoutId);
      if (response && response.code === 200) {
        setStatusMessage("ok");
        restoreCredentials(address);
        return;
      }
      // If code is not 200 but response exists, it might be auth error which means server is reachable
       if (response) {
          setStatusMessage("ok"); // Consider reachable
          restoreCredentials(address);
          return;
       }

      throw new Error();
    } catch (error) {
       // Fallback: If Subsonic check completely fails (network error), maybe try generic fetch?
       // But for now let's just show error
       setStatusMessage("error");
    }
  };

  const restoreCredentials = async (address: string) => {
    try {
      const savedCreds = await AsyncStorage.getItem(`creds_${address}`);
      if (savedCreds) {
        const { username: u, password: p } = JSON.parse(savedCreds);
        setUsername(u || "");
        setPassword(p || "");
      } else {
        setUsername("");
        setPassword("");
      }
    } catch (e) {
      console.error("Failed to restore credentials", e);
    }
  };

  const loadServerAddress = async () => {
    try {
      const savedAddress = await AsyncStorage.getItem("serverAddress");
      const savedHistory = await AsyncStorage.getItem("serverHistory");

      let historyItems = [
        { label: "http://localhost:3000", value: "http://localhost:3000" },
      ];

      if (savedHistory) {
        historyItems = JSON.parse(savedHistory);
      }

      setItems(historyItems);

      if (savedAddress) {
        setServerAddress(savedAddress);
          // Don't auto check immediately to avoid confusing UI state on load
          // checkServerConnectivity(savedAddress); 
      }
    } catch (error) {
      console.error("Failed to load server address:", error);
    }
  };

  const saveToHistory = async (address: string) => {
    if (!address) return;
    try {
      const currentHistory = await AsyncStorage.getItem("serverHistory");
      let history = currentHistory ? JSON.parse(currentHistory) : [];

      if (!history.find((item: any) => item.value === address)) {
        history.push({ label: address, value: address });
        await AsyncStorage.setItem("serverHistory", JSON.stringify(history));
        setItems(history);
      }
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  const handleDeleteHistory = async (address: string) => {
    try {
      const currentHistory = await AsyncStorage.getItem("serverHistory");
      if (currentHistory) {
        let history = JSON.parse(currentHistory);
        history = history.filter((item: any) => item.value !== address);
        await AsyncStorage.setItem("serverHistory", JSON.stringify(history));
        setItems(history);
        if (serverAddress === address) {
          setServerAddress("");
          setStatusMessage("error");
        }
      }
    } catch (error) {
      console.error("Failed to delete history:", error);
    }
  };

  const handleSubmit = async () => {
    if (!serverAddress) {
      Alert.alert("Error", "Please enter server address");
      return;
    }
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    // Registration check skipped for Subsonic as it throws "Not supported"
    
    try {
      setLoading(true);
      await AsyncStorage.setItem("serverAddress", serverAddress);
      await saveToHistory(serverAddress);

      // Save credentials for this server before logging in/registering
      // Security Note: Storing plain password is not ideal but standard for Subsonic legacy apps
      await AsyncStorage.setItem(
        `creds_${serverAddress}`,
        JSON.stringify({ username, password }),
      );

      // Configure Adapter with REAL credentials
      useNativeAdapter();

      if (isLogin) {
        await login({ username, password });
      } else {
        await register({ username, password });
      }

      router.replace("/(tabs)");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>
              {isLogin ? "欢迎登录" : "欢迎注册"}
            </Text>

            <View style={styles.form}>
              <Text style={[styles.label, { color: colors.text }]}>
                数据源地址
              </Text>
              <View style={[styles.inputContainer, { zIndex: 1000 }]}>
                <View style={styles.inputWarp}>
                  <DropDownPicker
                    open={open}
                    value={serverAddress}
                    items={items}
                    setOpen={setOpen}
                    setValue={setServerAddress}
                    setItems={setItems}
                    searchable={true}
                    searchPlaceholder="输入数据源地址..."
                    searchTextInputProps={{
                      autoCapitalize: "none",
                    }}
                    placeholder="选择或输入数据源地址"
                    addCustomItem={true}
                    onChangeValue={(value) => {
                      if (value) checkServerConnectivity(value as string);
                    }}
                    theme={colors.background === "#000000" ? "DARK" : "LIGHT"}
                    style={{
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    }}
                    dropDownContainerStyle={{
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    }}
                    textStyle={{
                      color: colors.text,
                    }}
                    placeholderStyle={{
                      color: colors.secondary,
                    }}
                    listMode="SCROLLVIEW"
                    onSelectItem={(item) => {
                      if (item.value) {
                        checkServerConnectivity(item.value as string);
                      }
                    }}
                    renderListItem={({ item, isSelected }) => {
                      // Only show delete button for items that are in our saved history
                      const isPersistent = items.some(
                        (i) => i.value === item.value,
                      );

                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 10,
                            borderBottomWidth: 0.5,
                            borderBottomColor: colors.border,
                            backgroundColor: isSelected
                              ? "rgba(150,150,150,0.1)"
                              : "transparent",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                            onPress={() => {
                              // Perform the selection logic
                              const value = item.value as string;
                              if (value) {
                                setServerAddress(value);
                                checkServerConnectivity(value);

                                // For custom items (not in history), save them
                                if (!isPersistent) {
                                  saveToHistory(value);
                                }
                              }

                              // Call library's onPress to handle internal state
                              // onPress(value as any);
                              setOpen(false);
                            }}
                          >
                            <Text style={{ color: colors.text, flex: 1 }}>
                              {item.label}
                            </Text>
                            {isSelected && (
                              <FontAwesome
                                name="check-circle"
                                size={16}
                                color={colors.primary}
                              />
                            )}
                          </TouchableOpacity>
                          {isPersistent && !item.parent && (
                            <TouchableOpacity
                              style={{ padding: 5, marginLeft: 10 }}
                              onPress={() =>
                                handleDeleteHistory(item.value as string)
                              }
                            >
                              <MaterialIcons
                                name="delete-outline"
                                size={20}
                                color={colors.secondary}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    }}
                  />
                </View>
                {statusMessage === "error" ? (
                  <MaterialIcons
                    style={styles.statusMessage}
                    name="error"
                    size={24}
                    color="red"
                  />
                ) : (
                  <FontAwesome
                    style={styles.statusMessage}
                    name="check-circle"
                    size={24}
                    color={colors.primary}
                  />
                )}
              </View>

              <Text style={[styles.label, { color: colors.text }]}>用户名</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                placeholder="用户名"
                placeholderTextColor={colors.secondary}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <Text style={[styles.label, { color: colors.text }]}>密码</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                placeholder="密码"
                placeholderTextColor={colors.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {!isLogin && (
                <>
                  <Text style={[styles.label, { color: colors.text }]}>
                    确认密码
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        borderColor: colors.border,
                        backgroundColor: colors.card,
                      },
                    ]}
                    placeholder="确认密码"
                    placeholderTextColor={colors.secondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </>
              )}

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text
                    style={[styles.buttonText, { color: colors.background }]}
                  >
                    {isLogin ? "登陆" : "注册"}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={[styles.switchText, { color: colors.secondary }]}>
                  {isLogin ? "没有账号？注册" : "已有账号？登录"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  form: {
    width: "100%",
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 20,
    alignItems: "center",
  },
  switchText: {
    fontSize: 14,
  },
  statusMessage: {},
  inputContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  inputWarp: {
    flex: 4,
  },
});
