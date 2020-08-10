import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';

import getValidateErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import Input from '../../components/Input/index';
import Button from '../../components/Button/index';

import {
  Container,
  BackButton,
  Title,
  UserAvatar,
  UserAvatarButton,
  SignOutButton,
  SignOutButtonText
} from './styles';
import { useAuth } from '../../hooks/AuthContext';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  new_password: string;
}

const Profile: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();
  const navigation = useNavigation();

  const formRef = useRef<FormHandles>(null);
  const inputMailRef = useRef<TextInput>(null);
  const inputOldPasswordRef = useRef<TextInput>(null);
  const inputNewPasswordRef = useRef<TextInput>(null);
  const inputRepeatNewPasswordRef = useRef<TextInput>(null);

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar câmera',
        chooseFromLibraryButtonTitle: 'Escolha da galeria',
      },
      response => {
        if(response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Erro ao carregar sua imagem');
          return;
        }

        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          uri: response.uri,
        });

        api.patch('users/avatar', data).then(apiResponse => {
          updateUser(apiResponse.data);
        });

      },
    );
  }, [updateUser, user.id]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          new_password: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('password'), undefined],
              'Senhas precisam ser iguais',
            ),
        });

        await schema.validate(data, { abortEarly: false });

        const { name, email, old_password, password, new_password } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                new_password,
              }
            : {}),
        };

        const response = await api.put('profile', formData);

        updateUser(response.data);

        Alert.alert('Perfil realizado com sucesso');

        navigation.goBack();
        /* await Profile {
        name: data.name;
        email: data.email;
        password: data.password;

      }
      */
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidateErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert(
          'Erro na atualização do cadastro',
          'Verifique seus dados e tente novamente',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleSignOut = useCallback(()=> {
    signOut();
  },[signOut]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={() => handleUpdateAvatar}>
              <UserAvatar
                source={{
                  uri: user.avatar_url ||
                  'https://arquivos-gobarber.s3.eu-west-2.amazonaws.com/placeholder-user-400x400.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLWVhc3QtMSJGMEQCIAe%2F26F7qSertpaG%2BfvJoPJb64hrPsUg1uVwRkLS2q58AiAKSTklOWwbPvoMOrO58LjtTHCQjrUqvuGo%2FhDpaSM6dSrEAgg8EAAaDDcyNTMyNTY0ODc1NCIMPtWjRweik3%2BKWipnKqECgNVCJ3vDxyzocKuSrIw4tl%2Fr4EdSJ%2BeTUa3drZ432C7VzgPVPT%2BICHESwKl7rigti6Bb8X89rb1sOQ3tvxpLFdmK6voELDywylllyFivsLvftbEQqN3eHub77YDolAAOlXuGw%2F3ZYu%2BrWSpIBZc7F6xUjAxR58qn0qBTDg9IY1T1LWtz3%2BGK2adXBZt4ljnDwIjEhM0wbe63HyeH5445yCABAO8aPA9qN8iqjY1zBd6bM%2FYf7Dzz1iimQj%2BUmpKOUHQkX%2BsYcU8Z4GIg6NOhOkigtX37jhi42ge2s3zZh3nKQ23LCxHdGwiAxScz7bO15rMwKz5JhGENgOa2jg7IN39N%2BMnFJrOoLkSJEgQs5OMX5OESPds0vWAIyQMXT8LpKTDK6cL5BTqxAin4AYp6EJjb5kvQx4zPle1uXXxMHlXaanQUGt6TvipPZ%2BcBt59f3IihDi%2BSHPot4UGqvXSPzSoZ1elsGdfV1v6Owa2P%2FmFuPCKtaPcabqYAXhziln%2F9qcqON2u0aHUIMD1q9K%2FOogCHiQRpjdXdzAtrqO7gWPTpPcWQvYVY47DfQjhnDf94vCdJ%2FZwbXUoiHuR3amb7vnrV0X7aZRmrdkZ7X4xHk3FzxAc%2FCgS9ix6cXv6Z%2F0TcBIpm9f%2BQbrwDUM6ZESCdkT8qLSjoBV36nXy0KUOUoj9xX81Cn6YaR7xdVwvQ2887DsHTBsBEAHDoLp%2BNS0%2BC91B0UW9La19VEbJN5vnLGI6VM1N3XeAV%2BESNSkwoT6HfdC%2BAR9gX%2BjmJPXdojvpt4EnZ1th3k6jDTsPZ&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200810T024642Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA2RYGHCNZPPC6WHGM%2F20200810%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Signature=b07b691d80ee856b20a4d9c72de80b3bf8f5614fc8b7c65aac719ac79314fd1a'
                  }}
              />
            </UserAvatarButton>

            <View>
              <Title>Meu Perfil</Title>
            </View>

            <Form initialData={user} ref={formRef} onSubmit={handleProfile}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCorrect={false}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => inputMailRef.current?.focus()}
              />
              <Input
                ref={inputMailRef}
                name="email"
                icon="mail"
                placeholder="Email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => inputOldPasswordRef.current?.focus()}
              />
              <Input
                ref={inputOldPasswordRef}
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => inputNewPasswordRef.current?.focus()}
              />

              <Input
                ref={inputNewPasswordRef}
                name="password"
                icon="lock"
                placeholder="Nova senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={() =>
                  inputRepeatNewPasswordRef.current?.focus()
                }
              />

              <Input
                ref={inputRepeatNewPasswordRef}
                name="new_password"
                icon="lock"
                placeholder="Confirmar nova senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar mudanças
              </Button>

              <SignOutButton onPress={() => handleSignOut}>
                <Icon name="log-out" size={24} color="#312e38" />
                <SignOutButtonText>Sair</SignOutButtonText>
              </SignOutButton>

            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
