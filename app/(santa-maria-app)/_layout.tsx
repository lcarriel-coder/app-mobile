import LogoutIconButton from "@/presentation/auth/components/LogoutIconButton";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { useThemeColor } from "@/presentation/theme/hooks/use-theme-color";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";


import { SafeAreaView } from "react-native-safe-area-context";

const CheckAuthenticationLayout = () => {
  const { status, checkStatus } = useAuthStore();
  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    checkStatus();
  }, []);

  if (status === "checking") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (status === "unauthenticated") {
    // Guardar la ruta del usuario
    return <Redirect href="/auth/login" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: backgroundColor,
          },

          contentStyle: {
            backgroundColor: backgroundColor,
          },
        }}
      >
        <Stack.Screen
          name="(home)/index"
          options={{
            title: "Productos",
             headerTitleAlign: "center",     
           headerLeft: () => <LogoutIconButton />,
          }}
        />

        <Stack.Screen
          name="product/[id]"
          options={{
            title: "Producto",
             headerTitleAlign: "center",     
          }}
        />


      </Stack>
    </SafeAreaView>
  );
};
export default CheckAuthenticationLayout;
