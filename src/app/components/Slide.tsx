import { Image, type ImageSource } from "expo-image";
import { Text, View } from "react-native";
const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

type Props = {
    description: string,
    image: ImageSource
}

export function Slide({description, image}: Props){
      console.log("IMAGE:", image);

    return (
        
            <View className = 'w-full h-[350px] relative'>
                
                <Image
                    className = 'absolute inset-0 w-full h-full'
                    source = {image}
                    contentFit = "cover"
                />

                <View className = "absolute inset-0 justify-end items-center pb-5 px-5">
                <Text className = 'text-white'>
                    {description}
                </Text>


            <View className = 'flex gap-2 flex-row'>
                {Array.from({length: 5}).map((_,index) => (
                    <View key = {index} className = 'w-3 h-3 rounded-full bg-white'>
                        
                    </View>
                )
                    
                )}
            </View>
            </View>
            </View>
        
    )
}