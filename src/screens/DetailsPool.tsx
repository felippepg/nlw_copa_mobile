import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Share } from "react-native";

import { api } from "../services/api";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PoolPros } from "../components/PoolCard"
import { PoolHeader } from "../components/PoolHeader";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string
}

export function DetailsPool () {
  const route = useRoute();
  
  const [isLoading, setIsLoading] = useState(true);
  const [poolDetails, setPoolDetails ] = useState<PoolPros>({} as PoolPros);
  const [optionSelected, setOptionsSelected] = useState<'Seus Palpites' | 'Ranking do Group'>()

  const toast = useToast();
  const { id } = route.params as RouteParams;

  const fetchPoolDetails = async () => {
    try {
      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);

    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Não foi possivel localizar esse bolão',
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare () {
    await Share.share({
      message: poolDetails.code
    })
  }

  useEffect(() => {
    fetchPoolDetails()
  }, [id]);

  if(isLoading) {
    return (
      <Loading />
    )
  }

  return(
    <VStack flex={1} bgColor="gray.900">
      <Header 
        title={poolDetails.title} 
        showBackButton 
        showShareButton
        onShare={handleCodeShare}
      />
      {
        poolDetails._count?.participants > 0 ?
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option 
              title="Seus Palpites" 
              isSelected={optionSelected === "Seus Palpites"} 
              onPress={() => setOptionsSelected('Seus Palpites')} 
            />
             <Option 
              title="Ranking do Grupo" 
              isSelected={optionSelected === "Ranking do Group"} 
              onPress={() => setOptionsSelected("Ranking do Group")} 
            />
          </HStack>
          <Guesses poolId={poolDetails.id} code={poolDetails.code}/>
        </VStack> :

        <EmptyMyPoolList code={poolDetails.code}/>
      }
    </VStack>
  )
}