import { registerRootComponent } from 'expo';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator.js';


const App = () =>{
    return(
        <NavigationContainer>
            <StackNavigator/>
         </NavigationContainer>
        
    )
}

registerRootComponent(App);
