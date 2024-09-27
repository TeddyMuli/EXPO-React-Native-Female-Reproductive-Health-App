export async function getUser (email: string | null | undefined) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/list_users/?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data[0]
  } catch (error) {
    console.error("Error fetching data: ", error)
  }
}

export const getCategories = async () => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/Mcategories/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching data: ", error)
  }
}

export async function getArticles () {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/forum_posts/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching data: ", error)
  }
}

export async function getProducts () {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/mobile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching data: ", error)
  }
}

export async function getPosts () {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/forum_posts/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching data: ", error)
  }
};

export async function getFavorites (user_id: any) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/favorites/?user_id=${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching data: ", error)
  }
}

export async function getReplies (post_id: any) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/replies/?post_id=${post_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching data: ", error)
  }
}

export async function getFavorite (user_id: any) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/favorites/?user_id=${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching data: ", error)
  }
}

export async function getRatings (user_id: any, product_id: number) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/ratings/?user_id=${user_id}&product_id=${product_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching data: ", error)
  }
}

export async function getProductRatings (product_id: number) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/ratings/?product_id=${product_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching data: ", error)
  }
}


export async function getAllUsers () {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/list_users/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching data: ", error)
  }
}

export async function getPeriods (user_id: string | null | undefined) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/periods/?user_id=${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching data: ", error)
  }
}

export async function getSettings (user_id: string | null | undefined) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/settings/?user_id=${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching data: ", error)
  }
}
