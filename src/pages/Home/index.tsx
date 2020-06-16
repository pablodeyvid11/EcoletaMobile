import React from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Image, StyleSheet, Text, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface IbgeUfProps {
  sigla: string;
  nome: string;
}

interface IbgeCityProps {
  nome: string;
}

const Home = () => {


  const criarAlerta = () =>
    Alert.alert(
      "Selecione a localidade",
      "Selecione o estado e a cidade para prossegir",
      [
        { text: "OK", onPress: () => { } }
      ],
      { cancelable: false }
    );

  const isDesativado = () => {
    if (selectedUf.nome === "NULL") {
      return true;
    } else {
      return false;
    }
  }


  const placeholderEstado = {
    label: 'Selecione um estado...',
    value: null,
    color: '#757575',
  };

  const placeholderCidade = {
    label: 'Selecione uma cidade...',
    value: null,
    color: '#757575',
  };

  const navigation = useNavigation();
  const [cityes, setCityes] = useState<string[]>([]);
  const [ufs, setUfs] = useState<IbgeUfProps[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('NULL');
  const [selectedUf, setSelectedUF] = useState<IbgeUfProps>({ sigla: 'NULL', nome: 'NULL' });


  useEffect(() => {
    axios.get<IbgeUfProps[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then((response) => {
      const ufsInitials = response.data;
      setUfs(ufsInitials);
    });
  }, []);

  function handleNavigateToPoints(uf: string, cidade: string) {
    if (uf !== "NULL" || cidade !== "NULL") {
      navigation.navigate('Points', {uf: uf, city: cidade});
    } else {
      criarAlerta();
    }
  }

  function carregarEstados() {
    let array = []
    array.push({ label: 'Football', value: 'football' });
    array.pop();
    ufs.map((uf) => {
      array.push({ label: uf.nome, value: uf.sigla });
    })
    return array;
  }

  function carregarCidades() {
    let array = []
    array.push({ label: 'Football', value: 'football' });
    array.pop();
    cityes.map((city) => {
      array.push({ label: city, value: city });
    })
    return array;
  }

  useEffect(() => {
    // carregar as cidades toda vez que o usuário selecionar uma UF diferente
    if (selectedUf.sigla === '0') {
      return;
    }
    axios.get<IbgeCityProps[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf.sigla}/municipios`).then((response) => {
      const cictyesNames = response.data.map(city => city.nome);
      setCityes(cictyesNames);
    });
  }, [selectedUf]);


  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 273, height: 368 }}
    >

      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View>
        <RNPickerSelect placeholder={placeholderEstado}
          onValueChange={(value) => {
            if (value == null) {
              setSelectedUF({ sigla: "NULL", nome: "NULL" });
            } else {
              setSelectedUF({ sigla: value, nome: value });
            }
          }}
          items={carregarEstados()}
        />

        <RNPickerSelect
          disabled={isDesativado()}
          placeholder={placeholderCidade}
          onValueChange={(value) => {
            if(value == null) {
              setSelectedCity("NULL");
            } else 
            setSelectedCity(value);
          }}
          items={carregarCidades()}
        />
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={() => {
          if (selectedUf.nome === "NULL" || selectedCity === "NULL") {
            criarAlerta();
          } else {
            handleNavigateToPoints(selectedUf.sigla, selectedCity)
          }
        }
        }>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 68,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;