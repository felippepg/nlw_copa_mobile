import { FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';

import { api } from '../services/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';

import { Game, GameProps} from "./Game";
import { Loading } from './Loading';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirtTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  const toast = useToast();

  const fetchGames = async () => {
    try {
      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);

    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Não foi possivel carregar os jogos',
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGuessConfirm = async (gameId: string) => {
    try {
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        toast.show({
          title: 'Informe os placares do palpite',
          placement: 'top',
          bgColor: 'red.500'
        });
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      });

      toast.show({
        title: 'Palpite cadastrado com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      });

      fetchGames()

    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Não foi possivel cadastrar palpite',
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames()
  }, [poolId]);

  if(isLoading) {
    return (
      <Loading />
    )
  }
  return (
    <FlatList 
      data={games}
      keyExtractor={ item => item.id}
      renderItem={({ item }) => (
        <Game 
          data={item}
          setFirstTeamPoints={setFirtTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code}/>}
    />
  );
}
