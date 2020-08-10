import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  UserNameText,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProviderContainer,
  ProvidersListTitle,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  const { user } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);


  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate],
  );

  return (
    <Container>
      <Header>
        <UserName>
          <HeaderTitle>
            Bem vindo, {'\n'}
            <UserNameText>{user.name}</UserNameText>
          </HeaderTitle>
        </UserName>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar
            source=
              {{
                uri: user.avatar_url ||
                'https://arquivos-gobarber.s3.eu-west-2.amazonaws.com/placeholder-user-400x400.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLWVhc3QtMSJGMEQCIAe%2F26F7qSertpaG%2BfvJoPJb64hrPsUg1uVwRkLS2q58AiAKSTklOWwbPvoMOrO58LjtTHCQjrUqvuGo%2FhDpaSM6dSrEAgg8EAAaDDcyNTMyNTY0ODc1NCIMPtWjRweik3%2BKWipnKqECgNVCJ3vDxyzocKuSrIw4tl%2Fr4EdSJ%2BeTUa3drZ432C7VzgPVPT%2BICHESwKl7rigti6Bb8X89rb1sOQ3tvxpLFdmK6voELDywylllyFivsLvftbEQqN3eHub77YDolAAOlXuGw%2F3ZYu%2BrWSpIBZc7F6xUjAxR58qn0qBTDg9IY1T1LWtz3%2BGK2adXBZt4ljnDwIjEhM0wbe63HyeH5445yCABAO8aPA9qN8iqjY1zBd6bM%2FYf7Dzz1iimQj%2BUmpKOUHQkX%2BsYcU8Z4GIg6NOhOkigtX37jhi42ge2s3zZh3nKQ23LCxHdGwiAxScz7bO15rMwKz5JhGENgOa2jg7IN39N%2BMnFJrOoLkSJEgQs5OMX5OESPds0vWAIyQMXT8LpKTDK6cL5BTqxAin4AYp6EJjb5kvQx4zPle1uXXxMHlXaanQUGt6TvipPZ%2BcBt59f3IihDi%2BSHPot4UGqvXSPzSoZ1elsGdfV1v6Owa2P%2FmFuPCKtaPcabqYAXhziln%2F9qcqON2u0aHUIMD1q9K%2FOogCHiQRpjdXdzAtrqO7gWPTpPcWQvYVY47DfQjhnDf94vCdJ%2FZwbXUoiHuR3amb7vnrV0X7aZRmrdkZ7X4xHk3FzxAc%2FCgS9ix6cXv6Z%2F0TcBIpm9f%2BQbrwDUM6ZESCdkT8qLSjoBV36nXy0KUOUoj9xX81Cn6YaR7xdVwvQ2887DsHTBsBEAHDoLp%2BNS0%2BC91B0UW9La19VEbJN5vnLGI6VM1N3XeAV%2BESNSkwoT6HfdC%2BAR9gX%2BjmJPXdojvpt4EnZ1th3k6jDTsPZ&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200810T024642Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA2RYGHCNZPPC6WHGM%2F20200810%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Signature=b07b691d80ee856b20a4d9c72de80b3bf8f5614fc8b7c65aac719ac79314fd1a'
              }} />
        </ProfileButton>
      </Header>
      <ProvidersList
        data={providers}
        keyExtractor={provider => provider.id}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => navigateToCreateAppointment(provider.id)}
          >
            <ProviderAvatar
              source=
                {{
                  uri: provider.avatar_url ||
                  'https://arquivos-gobarber.s3.eu-west-2.amazonaws.com/placeholder-user-400x400.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLWVhc3QtMSJGMEQCIAe%2F26F7qSertpaG%2BfvJoPJb64hrPsUg1uVwRkLS2q58AiAKSTklOWwbPvoMOrO58LjtTHCQjrUqvuGo%2FhDpaSM6dSrEAgg8EAAaDDcyNTMyNTY0ODc1NCIMPtWjRweik3%2BKWipnKqECgNVCJ3vDxyzocKuSrIw4tl%2Fr4EdSJ%2BeTUa3drZ432C7VzgPVPT%2BICHESwKl7rigti6Bb8X89rb1sOQ3tvxpLFdmK6voELDywylllyFivsLvftbEQqN3eHub77YDolAAOlXuGw%2F3ZYu%2BrWSpIBZc7F6xUjAxR58qn0qBTDg9IY1T1LWtz3%2BGK2adXBZt4ljnDwIjEhM0wbe63HyeH5445yCABAO8aPA9qN8iqjY1zBd6bM%2FYf7Dzz1iimQj%2BUmpKOUHQkX%2BsYcU8Z4GIg6NOhOkigtX37jhi42ge2s3zZh3nKQ23LCxHdGwiAxScz7bO15rMwKz5JhGENgOa2jg7IN39N%2BMnFJrOoLkSJEgQs5OMX5OESPds0vWAIyQMXT8LpKTDK6cL5BTqxAin4AYp6EJjb5kvQx4zPle1uXXxMHlXaanQUGt6TvipPZ%2BcBt59f3IihDi%2BSHPot4UGqvXSPzSoZ1elsGdfV1v6Owa2P%2FmFuPCKtaPcabqYAXhziln%2F9qcqON2u0aHUIMD1q9K%2FOogCHiQRpjdXdzAtrqO7gWPTpPcWQvYVY47DfQjhnDf94vCdJ%2FZwbXUoiHuR3amb7vnrV0X7aZRmrdkZ7X4xHk3FzxAc%2FCgS9ix6cXv6Z%2F0TcBIpm9f%2BQbrwDUM6ZESCdkT8qLSjoBV36nXy0KUOUoj9xX81Cn6YaR7xdVwvQ2887DsHTBsBEAHDoLp%2BNS0%2BC91B0UW9La19VEbJN5vnLGI6VM1N3XeAV%2BESNSkwoT6HfdC%2BAR9gX%2BjmJPXdojvpt4EnZ1th3k6jDTsPZ&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200810T024642Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA2RYGHCNZPPC6WHGM%2F20200810%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Signature=b07b691d80ee856b20a4d9c72de80b3bf8f5614fc8b7c65aac719ac79314fd1a'
                }}
            />
            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>
              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText> Segunda a Sexta </ProviderMetaText>
              </ProviderMeta>
              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText> 8h as 18h </ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
