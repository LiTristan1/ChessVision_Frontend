import { ImageBackground } from "expo-image";
import { cssInterop } from "nativewind";
import { Text, View } from "react-native";

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

cssInterop(ImageBackground, {
    className: "style"
})
cssInterop(View, {
    className: "style"
})
type Props = {
    description: string,
    image: string
}

export function Slide({description, image}: Props){
    return (
        <View className = 'w-full h-[250px] rounded-2xl overflow-hidden'>
            <ImageBackground
                className = 'w-full h-full'
                source = {image}
                contentPosition = "center"
                contentFit = 'cover'
            >
                <View className = 'flex-1 justify-center items-center px-5'>

                    <Text className = 'text-white'>
                        {description}
                    </Text>
                
                <View className = 'flex flex-row gap-[5px]'>
                    {Array.from({length: 5}).map((_,index) => (
                        <View key = {index} className = 'w-3 h-3 rounded-full bg-white'>
                            
                        </View>
                    )
                    )}
                </View>
                </View>
            </ImageBackground>
        </View>
    )
}