import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts, getCategories, getBestSelling, getUser } from '@/queries/queries';
import { atom, useAtom } from 'jotai';
import Loading from '@/components/Loading';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import ProductCard from '@/components/ProductCard';

export const cartAtom = atom<any[]>([]);

const ShopScreen = () => {
  const queryClient = useQueryClient();
  const { data: productsData, error: productsError, isLoading: productsLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const { data: bestSellingProducts, error: bestSellingProductsError, isLoading: bestSellingProductsLoading } = useQuery({ queryKey: ['bestselling'], queryFn: getBestSelling })

  const { user } = useAuth();
  const { data: userData } = useQuery({ queryKey: ['user'], queryFn: () => getUser(user?.email) })

  const [cart, setCart] = useAtom(cartAtom);
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);


  useEffect(() => {
    if (productsData) {
      if (selectedFilter === null || selectedFilter === -1) {
        setFilteredProducts(productsData);
      } else {
        setFilteredProducts(productsData.filter((product: any) => product.category_id === selectedFilter));
      }
    }
  }, [productsData, selectedFilter]);

  const addToCart = (item: any) => {
    setCart((prevCart: any) => {
      const itemIndex = prevCart.findIndex((cartItem: any) => cartItem.id === item.id);
      if (itemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[itemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };


  if (productsLoading) {
    return <Loading />;
  }

  if (productsError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text className='text-red-500 text-[18px] text-center mt-[20px]'>Failed to load products.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View className='flex justify-center items-center'>
        {/* Filter View */}
        <View className='flex flex-row justify-center items-center border border-black px-3 py-1 w-[300px] rounded-xl' style={styles.filterView}>
          <Text className=''>Filter: </Text>
          <Picker
            selectedValue={selectedFilter || "Select a category"}
            onValueChange={(itemValue: any) => setSelectedFilter(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a category" value="" />
            {categories?.map((category: any, index: number) => (
              <Picker.Item key={category.id} label={category.name} value={category.id} />
            ))}
          </Picker>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Top Categories for {userData?.name}</Text>
        <View style={styles.categories}>
          <CategoryButton title="Body Products" image={require('../../assets/images/bodyproductimage1.png')} />
          <CategoryButton title="Hair Products" image={require('../../assets/images/hairproduct.png')} />
        </View>

        <Text style={styles.sectionTitle}>Best Selling</Text>
        <ScrollView horizontal contentContainerStyle={styles.productRow}>
          {productsLoading && <Loading/>}
          {filteredProducts?.map((item: any, index: number) => (
            <ProductCard user={userData} addToCart={addToCart} key={index} product={item} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Essentials</Text>
        <ScrollView horizontal contentContainerStyle={styles.productRow}>
          {productsLoading && <Loading/>} 
          {filteredProducts?.map((item: any, index: number) => (
            <ProductCard user={userData} addToCart={addToCart} key={index} product={item} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recommended for {userData?.name}</Text>
        <ScrollView horizontal contentContainerStyle={styles.productRow}>
          {productsLoading && <Loading/>}
          {filteredProducts?.map((item: any, index: number) => (
            <ProductCard user={userData} addToCart={addToCart} key={index} product={item} />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const CategoryButton = ({ title, image }: { title: string, image: any }) => (
  <TouchableOpacity style={styles.categoryButton}>
    <Image source={image} style={styles.categoryImage} />
    <Text style={styles.categoryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FF69B4',
    borderBottomWidth: 0,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  categories: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  categoryButton: {
    width: 150,
    aspectRatio: 1,
    backgroundColor: '#FFC0CB',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    marginBottom: 10,
  },
  productRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
    gap: 16
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  filterView: {
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: 200,
  },
});

export default ShopScreen;
