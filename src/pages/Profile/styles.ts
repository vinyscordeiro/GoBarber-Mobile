import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';


export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 30 : 40}px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 50px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0 24px;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 20px;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;

export const SignOutButton = styled(RectButton)`
  width: 100%;
  height: 60px;
  background: #c9c3c4;
  border-radius: 10px;
  margin-top: 16px;

  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const SignOutButtonText = styled.Text`
  margin-left: 12px;
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #312e38;
`;

