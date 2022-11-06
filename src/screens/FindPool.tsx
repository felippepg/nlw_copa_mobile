import { Heading, VStack, Text, useToast } from "native-base";
import { Header } from "../components/Header";
import Logo from "../assets/logo.svg";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function FindPool() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  const toast = useToast();
  const { navigate } = useNavigation();

  async function handleJoinPool () {
    try {
      setIsLoading(true);

      if(!code.trim()) {
        return (
          toast.show({
            title: 'Informe um código',
            placement: 'top',
            bgColor: 'red.500'
          })
        );
      }
      await api.post('/pools/join', { code });
      toast.show({
        title: 'Você entrou no bolão com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      });

      navigate('pools');

    } catch (error) {
      console.log(error);

      if(error.response?.data?.message === 'Bolão não encontrado') {
        toast.show({
          title: error.response?.data?.message,
          placement: 'top',
          bgColor: 'red.500'
        });
      }

      if(error.response?.data?.message === 'Você já faz parte do bolão') {
        toast.show({
          title: error.response?.data?.message,
          placement: 'top',
          bgColor: 'red.500'
        });
      }

      toast.show({
        title: 'Não foi possivel localizar esse bolão',
        placement: 'top',
        bgColor: 'red.500'
      });

      setIsLoading(false);
    }
  }
  return (
    <VStack flex={1} backgroundColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="lg" mb={8} textAlign="center">
          Encontre um bolão através de {'\n'} seu código único
        </Heading>

        <Input 
          mb={2} 
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
        />
        <Button 
          title="Buscar Bolão" 
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  )
}