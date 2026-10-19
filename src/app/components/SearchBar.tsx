import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { colors } from "../../../themes/themes";

type Props = {
    placeholder: string;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    filterCategories: string[];
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;

};

export function SearchBar({
    placeholder,
    search,
    setSearch,
    filterCategories,
    selectedCategory,
    setSelectedCategory,
   
}: Props) {

    return (
        <View className="w-full gap-4">

            {/* Search Input */}
            <View
                className="flex-row items-center rounded-xl px-4 h-[50px]"
                style={{
                    backgroundColor: colors.componentBackground
                }}
            >
                <FontAwesome6
                    name="magnifying-glass"
                    size={18}
                    color={colors.iconTint}
                    iconStyle="solid"
                />

                <TextInput
                    className="flex-1 ml-3 text-white"
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    value={search}
                    onChangeText={
                        (newText) => {
                            setSearch(newText)
                            
                        }

                    }
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {search.length > 0 && (
                    <Pressable onPress={
                        () => setSearch("")
                    }>
                        <FontAwesome6
                            name="xmark"
                            size={18}
                            color={colors.iconTint}
                            iconStyle="solid"
                        />
                    </Pressable>
                )}
            </View>

            {/* Filter Categories */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    gap: 10,
                    paddingRight: 16
                }}
            >
                {["All", ...filterCategories].map((category) => {

                    const isSelected = selectedCategory === category;

                    return (
                        <Pressable
                            key={category}
                            onPress={() => setSelectedCategory(category)}
                            className="px-5 py-2 rounded-xl border"
                            style={{
                                backgroundColor: isSelected
                                    ? colors.iconTint
                                    : colors.componentBackground,

                                borderColor: isSelected
                                    ? colors.iconTint
                                    : "#334155"
                            }}
                        >
                            <Text
                                className="font-semibold"
                                style={{
                                    color: isSelected
                                        ? "#101C28"
                                        : "#FFFFFF"
                                }}
                            >
                                {category}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

        </View>
    );
}