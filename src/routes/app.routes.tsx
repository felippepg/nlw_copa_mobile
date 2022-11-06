import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { PlusCircle, SoccerBall } from 'phosphor-react-native'
import { useTheme } from 'native-base'

import { createStackNavigator } from '@react-navigation/stack';

import { NewPool } from '../screens/NewPool'
import { Pools } from '../screens/Pools'
import { Platform } from 'react-native'
import { FindPool } from '../screens/FindPool'
import { DetailsPool } from '../screens/DetailsPool';

const { Navigator, Screen } = createBottomTabNavigator()

export function AppRoutes () {
  //usar as cores do native base em outros componentes
  const { colors, sizes } = useTheme()
  const size = sizes[6]

  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.yellow[500],
      tabBarInactiveTintColor: colors.gray[300],
      tabBarStyle: {
        position: 'absolute',
        height: sizes[22],
        borderTopWidth: 0,
        backgroundColor: colors.gray[800]
      },
      tabBarItemStyle: {
        position: 'relative',
        top: Platform.OS === 'android' ? -10 : 0
      }
    }}>
      <Screen 
        name='new'
        component={NewPool}
        options={{
          tabBarIcon: ({ color }) => <PlusCircle size={size} color={color}/>,
          tabBarLabel: 'Novo bolão'
        }}
      />
      <Screen 
        name='pools'
        component={Pools}
        options={{
          tabBarIcon: ({ color }) => <SoccerBall size={size} color={color}/>,
          tabBarLabel: 'Meus bolões '
        }}
      />
      <Screen 
        name='find'
        component={FindPool}
        options={{ tabBarButton: () => null}}
      />

      <Screen 
        name='details'
        component={DetailsPool}
        options={{ tabBarButton: () => null}}
      />
      
    </Navigator>
  )
}