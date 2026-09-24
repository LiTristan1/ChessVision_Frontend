import { NativeTabs } from "expo-router/unstable-native-tabs";
import "../../global.css";
export default function RootLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="house.fill"
        >

        </NativeTabs.Trigger.Icon>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explorer">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="house.fill"
        >
        </NativeTabs.Trigger.Icon>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="analysis">
        <NativeTabs.Trigger.Label>Analysis</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="house.fill"
        >

        </NativeTabs.Trigger.Icon>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="cameraLog">
        <NativeTabs.Trigger.Label>Camera Log</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="house.fill"
        >

        </NativeTabs.Trigger.Icon>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="house.fill"
        >

        </NativeTabs.Trigger.Icon>
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
