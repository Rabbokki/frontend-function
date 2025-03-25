import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  return {
    ...(accessToken && { Access_Token: accessToken }),
    ...(refreshToken && { Refresh: refreshToken }),
  };
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:8081/post");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch posts");
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8081/post/find/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch post");
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async ({ formData, accessToken }, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/post/create",
        formData,
        {
          headers: {
            Access_Token: accessToken,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


// export const createPost = createAsyncThunk(
//   "posts/createPost",
//   async ({newProduct, accessToken}, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();
      
//       // 이미지 파일을 formData에 추가
//       newProduct.images.forEach((image) => {
//         formData.append("postImg", image); // 이미지 배열을 "postImg"라는 이름으로 추가
//       });
      
//       // 다른 데이터를 formData에 추가
//       formData.append("dto", JSON.stringify({
//         name: newProduct.name,
//         condition: newProduct.condition,
//         description: newProduct.description,
//         tags: newProduct.tags,
//         price: newProduct.price,
//         acceptPriceOffer: newProduct.acceptPriceOffer,
//         shippingIncluded: newProduct.shippingIncluded,
//       }));
      
//       // 서버로 데이터 전송
//       const response = await axios.post("http://localhost:8081/post/create", formData, {
//         headers: getAuthHeaders(),
//         "Content-Type": "multipart/form-data" // 이 부분을 제거해도 됩니다.
//         }
//       );
      
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to register product");
//     }
//   }
// );

