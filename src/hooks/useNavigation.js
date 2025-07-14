import { useNavigate } from 'react-router-dom';
import { useTelegram } from './useTelegram';

export const useNavigation = () => {
  const navigate = useNavigate();
  const { showNotification } = useTelegram();

  const navigateTo = (path) => {
    try {
      navigate(path);
    } catch (error) {
      showNotification(`Ошибка навигации: ${error.message}`, "error");
    }
  };

  const goBack = () => {
    try {
      navigate(-1);
    } catch (error) {
      showNotification(`Ошибка навигации: ${error.message}`, "error");
    }
  };

  return { navigateTo, goBack };
};