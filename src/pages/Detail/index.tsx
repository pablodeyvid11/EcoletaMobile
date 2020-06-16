import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, Linking } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler';
import Constants from 'expo-constants'
import * as MailComposer from 'expo-mail-composer';

import API from './../../services/api'


interface ParamsProps {
  point_id: number
}
interface dataProps {
  point: {
    Image: string;
    image_url: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  }
  items: { title: string }[]
}

const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as ParamsProps;

  const [data, setData] = useState<dataProps>({} as dataProps);

  useEffect(() => {
    API.get(`points/${routeParams.point_id}`).then(response => {
      setData(response.data);
    })
  }, [])

  if (!data?.point) {
    return null;
  }

  function pegarNomes() {
    let stringVar = "";
    data?.items.map((item) => {
      stringVar += item.title + ", "
    });

    stringVar = stringVar.trim().substring(0, stringVar.length - 2);
    return stringVar;
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data?.point.email]
    });
  }

  function handleWhatsapp() {
    console.log(data.point.whatsapp);
    const pattern = RegExp('^\\(?(\\d{2,3})?\\)?\\s?(\\d{4,5})-?\\s?(\\d{4})$');

    const result = pattern.exec(data.point.whatsapp) !== null ? pattern.exec(data.point.whatsapp) : [];
    console.log(result);
    let wpp = "";

    if (result != null) {
      wpp += result[1] + result[2] + result[3];
    }
    console.log(wpp);

    Linking.openURL(`whatsapp://send?phone=${"+55" + wpp}&text=Tenho interesse na coleta de resíduos.`);
  }

  function handleNavigateBack() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{ uri: data?.point.image_url }}></Image>
        <Text style={styles.pointName}>{data?.point.name}</Text>
        <Text style={styles.pointItems}>{pegarNomes()}</Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{`${data?.point.city}/${data?.point.uf}`}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name='whatsapp' size={20} color='#FFF' />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name='mail' size={20} color='#FFF' />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;