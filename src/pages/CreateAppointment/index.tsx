import React, { useCallback, useState, useEffect, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import api from '../../services/api';
import { useAuth } from '../../hooks/AuthContext';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  ProfileButton,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProvidersContainer,
  ProvidersAvatar,
  ProvidersName,
  Calendar,
  Title,
  OpenDayPickerButton,
  OpenDayPickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();

  const route = useRoute();
  const routeParams = route.params as RouteParams;
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );
  const [selectedHour, setselectedHour] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);

  const navigateToDashboard = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectedProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToogleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChange = useCallback((_, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setselectedHour(0);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setselectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);
      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });
      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (err) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao criar o agendamento, tente novamente',
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });

  }, []);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => ({
          hour,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
          available,
      }));

  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => ({
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
      }));
  }, [availability]);

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateToDashboard}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <ProfileButton onPress={navigateToProfile}>
        <UserAvatar
          source=
            {{
              uri: user.avatar_url ||
              'https://arquivos-gobarber.s3.eu-west-2.amazonaws.com/placeholder-user-400x400.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLWVhc3QtMSJGMEQCIAe%2F26F7qSertpaG%2BfvJoPJb64hrPsUg1uVwRkLS2q58AiAKSTklOWwbPvoMOrO58LjtTHCQjrUqvuGo%2FhDpaSM6dSrEAgg8EAAaDDcyNTMyNTY0ODc1NCIMPtWjRweik3%2BKWipnKqECgNVCJ3vDxyzocKuSrIw4tl%2Fr4EdSJ%2BeTUa3drZ432C7VzgPVPT%2BICHESwKl7rigti6Bb8X89rb1sOQ3tvxpLFdmK6voELDywylllyFivsLvftbEQqN3eHub77YDolAAOlXuGw%2F3ZYu%2BrWSpIBZc7F6xUjAxR58qn0qBTDg9IY1T1LWtz3%2BGK2adXBZt4ljnDwIjEhM0wbe63HyeH5445yCABAO8aPA9qN8iqjY1zBd6bM%2FYf7Dzz1iimQj%2BUmpKOUHQkX%2BsYcU8Z4GIg6NOhOkigtX37jhi42ge2s3zZh3nKQ23LCxHdGwiAxScz7bO15rMwKz5JhGENgOa2jg7IN39N%2BMnFJrOoLkSJEgQs5OMX5OESPds0vWAIyQMXT8LpKTDK6cL5BTqxAin4AYp6EJjb5kvQx4zPle1uXXxMHlXaanQUGt6TvipPZ%2BcBt59f3IihDi%2BSHPot4UGqvXSPzSoZ1elsGdfV1v6Owa2P%2FmFuPCKtaPcabqYAXhziln%2F9qcqON2u0aHUIMD1q9K%2FOogCHiQRpjdXdzAtrqO7gWPTpPcWQvYVY47DfQjhnDf94vCdJ%2FZwbXUoiHuR3amb7vnrV0X7aZRmrdkZ7X4xHk3FzxAc%2FCgS9ix6cXv6Z%2F0TcBIpm9f%2BQbrwDUM6ZESCdkT8qLSjoBV36nXy0KUOUoj9xX81Cn6YaR7xdVwvQ2887DsHTBsBEAHDoLp%2BNS0%2BC91B0UW9La19VEbJN5vnLGI6VM1N3XeAV%2BESNSkwoT6HfdC%2BAR9gX%2BjmJPXdojvpt4EnZ1th3k6jDTsPZ&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200810T024642Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA2RYGHCNZPPC6WHGM%2F20200810%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Signature=b07b691d80ee856b20a4d9c72de80b3bf8f5614fc8b7c65aac719ac79314fd1a'
            }}
        />
        </ProfileButton>
      </Header>
      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProvidersContainer
                onPress={() => handleSelectedProvider(provider.id)}
                selected={provider.id === selectedProvider}
              >
                <ProvidersAvatar source=
                  {{
                    uri: provider.avatar_url ||
                    'https://arquivos-gobarber.s3.eu-west-2.amazonaws.com/placeholder-user-400x400.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLWVhc3QtMSJGMEQCIAe%2F26F7qSertpaG%2BfvJoPJb64hrPsUg1uVwRkLS2q58AiAKSTklOWwbPvoMOrO58LjtTHCQjrUqvuGo%2FhDpaSM6dSrEAgg8EAAaDDcyNTMyNTY0ODc1NCIMPtWjRweik3%2BKWipnKqECgNVCJ3vDxyzocKuSrIw4tl%2Fr4EdSJ%2BeTUa3drZ432C7VzgPVPT%2BICHESwKl7rigti6Bb8X89rb1sOQ3tvxpLFdmK6voELDywylllyFivsLvftbEQqN3eHub77YDolAAOlXuGw%2F3ZYu%2BrWSpIBZc7F6xUjAxR58qn0qBTDg9IY1T1LWtz3%2BGK2adXBZt4ljnDwIjEhM0wbe63HyeH5445yCABAO8aPA9qN8iqjY1zBd6bM%2FYf7Dzz1iimQj%2BUmpKOUHQkX%2BsYcU8Z4GIg6NOhOkigtX37jhi42ge2s3zZh3nKQ23LCxHdGwiAxScz7bO15rMwKz5JhGENgOa2jg7IN39N%2BMnFJrOoLkSJEgQs5OMX5OESPds0vWAIyQMXT8LpKTDK6cL5BTqxAin4AYp6EJjb5kvQx4zPle1uXXxMHlXaanQUGt6TvipPZ%2BcBt59f3IihDi%2BSHPot4UGqvXSPzSoZ1elsGdfV1v6Owa2P%2FmFuPCKtaPcabqYAXhziln%2F9qcqON2u0aHUIMD1q9K%2FOogCHiQRpjdXdzAtrqO7gWPTpPcWQvYVY47DfQjhnDf94vCdJ%2FZwbXUoiHuR3amb7vnrV0X7aZRmrdkZ7X4xHk3FzxAc%2FCgS9ix6cXv6Z%2F0TcBIpm9f%2BQbrwDUM6ZESCdkT8qLSjoBV36nXy0KUOUoj9xX81Cn6YaR7xdVwvQ2887DsHTBsBEAHDoLp%2BNS0%2BC91B0UW9La19VEbJN5vnLGI6VM1N3XeAV%2BESNSkwoT6HfdC%2BAR9gX%2BjmJPXdojvpt4EnZ1th3k6jDTsPZ&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200810T024642Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA2RYGHCNZPPC6WHGM%2F20200810%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Signature=b07b691d80ee856b20a4d9c72de80b3bf8f5614fc8b7c65aac719ac79314fd1a'
                  }}
                />

                <ProvidersName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProvidersName>
              </ProvidersContainer>
            )}
          />
        </ProvidersListContainer>
        <Calendar>
          <Title>Escolha a data</Title>
          <OpenDayPickerButton onPress={handleToogleDatePicker}>
            <OpenDayPickerButtonText>
              Selecionar outra data
            </OpenDayPickerButtonText>
          </OpenDayPickerButton>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              onChange={handleDateChange}
              textColor="#f4ede8"
              value={selectedDate}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>
          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(({ hour, hourFormatted, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={hourFormatted}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourText selected={selectedHour === hour}>
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability.map(
                ({ hourFormatted, hour, available }) => (
                  <Hour
                    enabled={available}
                    selected={selectedHour === hour}
                    available={available}
                    key={hourFormatted}
                    onPress={() => {
                      handleSelectHour(hour);
                    }}
                  >
                    <HourText selected={selectedHour === hour}>
                      {hourFormatted}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>
        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
