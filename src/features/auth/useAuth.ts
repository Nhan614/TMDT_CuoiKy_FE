import { useAppDispatch } from "../../app/hooks";
import { loginWithGoogle } from "./authThunk";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      return;
    }

    try {
      const result = await dispatch(
        loginWithGoogle({ idToken })
      ).unwrap();
      if (result.success) {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleError = () => {
    console.log("Lỗi đăng nhập với Google!");
  }

  return {
    actions: {
      handleSuccess,
      handleError,
    }
  }
}