import { getFavorite, getRatings } from "@/queries/queries";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

const ProductCard = ({ product, addToCart, user }: { product: any, addToCart: (product: any) => void, user: any }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);

  const { data: ratingData } = useQuery({ queryKey: ['rating'], queryFn: () => getRatings(user.id, product.id) })
  const { data: favoriteData } = useQuery({ queryKey: ['rating'], queryFn: () => getFavorite(user.id, product.id) })

  useEffect(() => {
    if (ratingData) {
      setRating(ratingData.rating)
    };

    if (favoriteData) {
      setIsFavorite(favoriteData.is_favorite)
    }
  }, [ratingData, favoriteData]);

  const saveRating = async () => {
    const user_id = user.id
    const product_id = product.id
    
    const to_send = {
      product_id,
      user_id,
      rating
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(to_send)
      });

      const body = await response.json();

      if (!response.ok) console.error("Error saving rating: ", body)
      console.log("Rating saved!")
    } catch (error) {
      console.error("Error: ", error)
    }
  };

  const saveFavorite = async () => {
    const user_id = user.id
    const product_id = product.id
    const is_favorite = isFavorite

    const to_send = {
      user_id,
      product_id,
      is_favorite
    }
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(to_send)
      });

      const body = await response.json();

      if (!response.ok) console.error("Error saving favorite: ", body)
      console.log("Favorite saved!")
    } catch (error) {
      console.error("Error: ", error)
    }
  }

  return (
    <View style={styles.productCard}>
      <View className='flex flex-row justify-between'>
        {product?.image ? (
          <Image source={{ uri: product?.image }} height={100} width={100} style={{ borderRadius: 5, marginBottom: 10 }} />
        ) : (
          <View style={styles.productImagePlaceholder} />
        )}

      <TouchableOpacity
        className='ml-2' 
        onPress={() => {
          setIsFavorite(!isFavorite);
          saveFavorite()
        }}
      >
        <Heart fill={`${isFavorite ? "red" : "none"}`} className={`${isFavorite ? "text-red-500" : "text-black"}`} />
      </TouchableOpacity>
      </View>
      <Text style={styles.productName}>{product?.name}</Text>
      {showDetails && <Text style={styles.productDescription}>{product?.description}</Text>}
      <Text style={styles.productPrice}>{product?.price}</Text>
      <View className='flex flex-row'>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity 
            key={star} 
            onPress={() => {
              setRating(star);
              saveRating();
            }}
          >
            <FontAwesome
              name="star"
              size={16}
              color={star <= rating ? "#FFD700" : "#D3D3D3"}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>
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
  star: {
    margin: 5,
  },
});

export default ProductCard;
