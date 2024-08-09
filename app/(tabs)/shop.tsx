import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts } from '@/queries/queries';
import { atom, useAtom } from 'jotai';
import Loading from '@/components/Loading';

export const cartAtom = atom<any[]>([]);

const ShopScreen = () => {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const [cart, setCart] = useAtom(cartAtom);

  const addToCart = (item: any) => {
    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      if (itemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[itemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Top Categories for Username</Text>
        <View style={styles.categories}>
          <CategoryButton title="Body Products" image={require('../../assets/images/bodyproductimage1.png')} />
          <CategoryButton title="Hair Products" image={require('../../assets/images/hairproduct.png')} />
        </View>

        <Text style={styles.sectionTitle}>Most Purchased</Text>
        <ScrollView horizontal contentContainerStyle={styles.productRow}>
          {query.isLoading && <Loading/>} 
          {query.data?.map((item: any, index: number) => (
            <ProductCard addToCart={addToCart} key={index} product={item} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Essentials</Text>
        <ScrollView horizontal contentContainerStyle={styles.productRow}>
          {query.isLoading && <Loading/>} 
          {query.data?.map((item: any, index: number) => (
            <ProductCard addToCart={addToCart} key={index} product={item} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Food Stuff</Text>
        <Text style={styles.emptyText}>Nothing found</Text>

        <Text style={styles.sectionTitle}>Recommended for Your Username</Text>
        <ScrollView horizontal contentContainerStyle={styles.productRow}>
          {query.isLoading && <Loading/>}
          {query.data?.map((item: any, index: number) => (
            <ProductCard addToCart={addToCart} key={index} product={item} />
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

const ProductCard = ({ product, addToCart }: { product: any, addToCart: (product: any) => void }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <View style={styles.productCard}>
      {product?.image ? (
        <Image source={{ uri: product?.image }} width={100} height={100} style={{ borderRadius: 5, marginBottom: 10 }} />
      ) : (
        <View style={styles.productImagePlaceholder} />
      )}
      <Text style={styles.productName}>{product?.name}</Text>
      {showDetails && <Text style={styles.productDescription}>{product?.description}</Text>}
      <Text style={styles.productPrice}>{product?.price}</Text>
      <TouchableOpacity onPress={() => setShowDetails(!showDetails)} style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>More details</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => addToCart(product)} className='bg-[#E4258F] p-2 mt-[10px] rounded-lg'>
        <Text className='text-white text-[12px]'>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  productCard: {
    width: 150,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  productImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  detailsButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FF69B4',
    borderRadius: 5,
    padding: 5,
  },
  detailsButtonText: {
    color: '#FF69B4',
    fontSize: 12,
  },
  emptyText: {
    marginLeft: 15,
    color: '#666',
    fontStyle: 'italic',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default ShopScreen;
