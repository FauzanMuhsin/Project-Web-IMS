import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useLogOut = () => {
    const navigate = useNavigate();
    const Out = async () => {
        try {
            // @ts-ignore
            // eslint-disable-next-line
            const response = await axios.delete('http://localhost:5000/logout')
            localStorage.clear()
            window.location.href = "/";
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }
    return Out;
}
