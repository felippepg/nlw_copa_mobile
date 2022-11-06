import { Button as ButtonNativeBase, Text, IButtonProps } from 'native-base'

interface Props extends IButtonProps {
  title: string
  type?: 'PRIMARY' | 'SECONDARY'
}

export function Button({ title, type = 'PRIMARY', ...rest }: Props) {
  return (
    <ButtonNativeBase 
      w="full"
      h={14}
      rounded="sm"
      fontSize="md"
      textTransform="uppercase"
      bg={type === 'SECONDARY' ? 'red.500' : 'yellow.500'}
      //ao clicar no botão
      _pressed={{
        bg: type === 'SECONDARY' ? 'red.400': 'yellow.400'
      }}
      {...rest}
    >
      <Text
        fontSize="sm"
        fontFamily="heading"
        color={type === 'SECONDARY' ? 'white' : 'black'}
      >{title}</Text>
    </ButtonNativeBase>
  )
}