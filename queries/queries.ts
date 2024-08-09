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
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/shop/latest/`, {
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

