import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator.js';
import { UIDProvider } from './functions/UIDContext.js';


export default function App() {
    return(
        <NavigationContainer>
            <UIDProvider>
            <StackNavigator/>
            </UIDProvider>
         </NavigationContainer>
        
    )
}