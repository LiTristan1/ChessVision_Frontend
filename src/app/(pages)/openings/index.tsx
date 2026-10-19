import { getOpeningDB } from "@/app/api/games"
import { OpeningDisplayBox } from "@/app/components/OpeningDisplayBox"
import PageHeader from "@/app/components/PageHeader"
import { SearchBar } from "@/app/components/SearchBar"
import { fuzzySearch } from "@/app/helpers/Search"
import { useAppDispatch, useAppSelector } from "@/app/hooks/reduxHooks"
import { setOpenings } from "@/app/Store/slices/GamesSlices"
import { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, FlatList, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { containers } from "../../../../themes/themes"
export default function OpeningExplorer() {
    const openingOptions = useAppSelector(state => state.games.openings)
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const [searchValue, setSearchValue] = useState<string>("")
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const dispatch = useAppDispatch()
    useEffect(() => {
        async function getOpeningData() {
            try {
                setIsLoading(true)
                const response = await getOpeningDB()
                if (response == undefined) {
                    console.log("opening response is undefined")
                    return;
                }
                dispatch(setOpenings(response))
                setIsLoading(false)
            } catch (e) {
                console.log("Error getting opening data inside opening explorer page")
            }
        }

        if (openingOptions.length == 0) {
            getOpeningData()
        }
    }, [])





    const displayedOptions = useMemo(() => {
        return openingOptions.filter(opening => {
            const matchesSearch =
                fuzzySearch(searchValue, opening.name) ||
                fuzzySearch(searchValue, opening.eco) ||
                fuzzySearch(searchValue, opening.opening_class);

            const matchesCategory =
                selectedCategory === "" ||
                opening.opening_class.toUpperCase() ===
                selectedCategory.toUpperCase();

            return matchesSearch && matchesCategory;
        });
    }, [openingOptions, searchValue, selectedCategory]);
    return (

        <SafeAreaView style={containers.PrimaryContainer}>
            {
                isLoading && (<View className="flex-1 items-center justify-center">
                    <ActivityIndicator
                        size="large"
                        color="#A8C8E7"
                    />

                    <Text className="text-[#91A8BC] text-sm mt-4">
                        Loading chess openings...
                    </Text>
                </View>
                )
            }
            {!isLoading && (
                <View className='flex-1 w-full h-full'>
                    <PageHeader
                        title="Openings"
                        subtitle="Search and Explore Chess Openings"
                    />
                    <SearchBar
                        placeholder="Search by name, ECO Code or moves..."
                        search={searchValue}
                        setSearch={setSearchValue}
                        filterCategories={['A', 'B', 'C', 'D', 'E']}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}

                    />


                    <FlatList
                        className="flex-1 w-full mt-5"
                        data={displayedOptions}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <OpeningDisplayBox opening={item} />
                        )}
                        initialNumToRender={8}
                        maxToRenderPerBatch={8}
                        windowSize={5}
                        ItemSeparatorComponent={() => <View className="h-2" />}
                        contentContainerStyle={{
                            paddingBottom: 30,
                        }}
                    />
                </View>
            )
            }

        </SafeAreaView>
    )
}