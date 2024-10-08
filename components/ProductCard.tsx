import { getAllUsers, getFavorite, getProductRatings, getRatings } from "@/queries/queries";
import { FontAwesome } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Heart, MoveLeft, SendHorizontal } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Modal, TextInput } from 'react-native';
  

const ProductCard = ({ product, addToCart, user }: { product: any, addToCart: (product: any) => void, user: any }) => {
  const queryClient = useQueryClient();

  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  //const { data: ratingData } = useQuery({ queryKey: ['rating'], queryFn: () => getRatings(user.id, product.id) })
  const { data: favoriteData } = useQuery({ queryKey: ['favorite', product.id], queryFn: () => getFavorite(user.id) })
  const { data: productRatings } = useQuery({ queryKey: ['ratings', product.id], queryFn: () => getProductRatings(product.id) })
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: getAllUsers })

  const productRatingsForProduct = productRatings?.filter((rating: any) => rating.product_id == product.id);
  const totalRatings = productRatingsForProduct?.reduce((sum: any, rating: any) => sum + rating.rating, 0);
  const averageRating = productRatingsForProduct?.length ? (totalRatings / productRatingsForProduct?.length).toFixed(1) : "No ratings";
  
  useEffect(() => {
    if (favoriteData) {
      const isFavoriteProduct = favoriteData.some((favorite: any) => favorite.product_id == product.id);
      setIsFavorite(isFavoriteProduct);
    }
  }, []);

  const saveRating = async (to_send: {product_id: number, user_id: number, rating: number}) => {
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

  const { mutate } = useMutation({
    mutationFn: (to_send: { product_id: number, user_id: number, rating: number }) => saveRating(to_send),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] })
    }
  })


  const submitRating = (rating: number) => {
    const user_id = user.id
    const product_id = product.id
    
    const to_send = {
      product_id,
      user_id,
      rating
    }
    console.log("To send: ", to_send)
    mutate(to_send)
  }

  const saveFavorite = async () => {
    const user_id = user.id
    const product_id = product.id

    const to_send = {
      user_id,
      product_id,
    }
    const method = isFavorite ? "POST" : "DELETE";
    const action = isFavorite ? "saving" : "deleting";
  
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/favorites`, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(to_send)
      });
  
      const body = await response.json();
  
      if (!response.ok) {
        console.error(`Error ${action} favorite: `, body);
      } else {
        console.log(`Favorite ${isFavorite ? "saved" : "deleted"}!`, body);
      }
    } catch (error) {
      console.error("Error: ", error);
    }  
  }

  const saveReview = async (to_send: { user_id: number, product_id: number, review: string }) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/ratings`, {
        method: "POST",
        headers: {
          "Content-Application": "application/json"
        },
        body: JSON.stringify(to_send)
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error: ", data)
      } else {
        console.log("Review saved: ", data)
      }
    } catch (error) {
      console.error("Error: ", error)
    }
  }

  const { mutate: mutateReview } = useMutation({
    mutationFn: (to_send: { product_id: number, user_id: number, review: string }) => saveReview(to_send),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] })
      setReview("")
    }
  })

  const submitReview = (review: string) => {
    const user_id = user.id
    const product_id = product.id
    
    const to_send = {
      product_id,
      user_id,
      review
    }
    console.log("Review: ", to_send)

    mutateReview(to_send)
  }

  return (
    <>
    {!showDetails ? (
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
      <Text style={styles.productPrice}>{product?.price}</Text>
      <View className="flex flex-row justify-center items-center">
        <Text className="">{averageRating}</Text>
        <FontAwesome
          name="star"
          size={16}
          color={"#FFD700"}
          style={styles.star}
        />
      </View>
      <TouchableOpacity onPress={() => setShowDetails(!showDetails)} style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>More details</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => addToCart(product)} className='bg-[#E4258F] p-2 mt-[10px] rounded-lg'>
        <Text className='text-white text-[12px]'>Add to Cart</Text>
      </TouchableOpacity>
    </View>
    ) : (
      <Modal onRequestClose={() => setShowDetails(false)}>
        <ScrollView className="m-4">
          <ChevronLeft className="text-black py-4" onPress={() => setShowDetails(false)} />
          <View className='flex flex-row justify-center'>
            {product?.image ? (
              <Image source={{ uri: product?.image }} height={300} width={300} style={{ borderRadius: 5, marginBottom: 10 }} />
            ) : (
              <View style={styles.productImagePlaceholder} />
            )}

            <TouchableOpacity
              className='mx-4' 
              onPress={() => {
                setIsFavorite(!isFavorite);
                saveFavorite()
              }}
            >
              <Heart fill={`${isFavorite ? "red" : "none"}`} className={`${isFavorite ? "text-red-500" : "text-black"}`} />
            </TouchableOpacity>
          </View>
          <Text style={styles.productName}>{product?.name}</Text>
          <Text style={styles.productPrice}>{product?.price}</Text>
          <Text className="max-w-[300px] text-[#666] text-[12px]">{product.description}</Text>

          <TouchableOpacity onPress={() => addToCart(product)} className='bg-[#E4258F] p-2 mt-[10px] rounded-lg'>
            <Text className='text-white text-[12px] text-center'>Add to Cart</Text>
          </TouchableOpacity>

          <View className="flex flex-row items-center p-2">
            <Text className="mr-2">{averageRating}</Text>
            <FontAwesome
              name="star"
              size={16}
              color={"#FFD700"}
              style={styles.star}
            />
          </View>

          <View className='flex flex-row'>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity 
                key={star} 
                onPress={() => {
                  setRating(star);
                  submitRating(star);
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

          <View>
            <View className="flex flex-row items-center">
              <TextInput
                value={review}
                onChangeText={value => setReview(value)}
                className="p-3 outline-black rounded-xl"
                placeholder="Enter review"
              />
              <SendHorizontal onPress={() => submitReview(review)} className="text-black ml-auto"/>
            </View>

            {productRatings?.map((review: any, index: number) => {
              const user = users?.find((user: any) => user.id == review.user_id);
              const userName = user ? user.name : "Unknown user"
              return (
                <View key={index} className="flex flex-row justify-start items-start max-w-[300px] p-3 rounded-xl border-b border-black my-1">
                  <Text className="text-black mr-4">{userName}</Text>
                  <Text className="text-[#666]">{review.review}</Text>
                </View>
              )
            })}
          </View>

        </ScrollView>
      </Modal>
    )}
    </>
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
