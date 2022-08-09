/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

import {SearchBar} from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';
import firestore from '@react-native-firebase/firestore';
import firebase from 'firebase';
import storage from '@react-native-firebase/storage';

export default function ExploreScreen({navigation, route}) {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [books, setBooks] = useState([]);

  const ItemSeparatorView = () => {
    return (
      <View style={{height: 2, width: '100%', backgroundColor: 'black'}}></View>
    );
  };

  const fetchBook = async () => {
    try {
      const list = [];

      await firestore()
        .collection('explore_books')
        .orderBy('title', 'asc')
        .get()
        .then(querySnapshot => {
          // console.log('Total books from users', querySnapshot.size);
          querySnapshot.forEach(doc => {
            const {author, book_image, genre_id, summary, title} = doc.data();
            list.push({
              id: doc.id,
              title,
              book_image,
              author,
              genre_id,
              summary,
            });
          });
        });

      setBooks(list);
      if (loading) {
        setLoading(false);
      }

      console.log('Books', list);
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect(() => {
  //   fetch('http://www.json-generator.com/api/json/get/ctSwkymQAy?indent=2')
  //     .then(response => response.json())
  //     .then(responseJson => {
  //       setFilteredDataSource(responseJson);
  //       setMasterDataSource(responseJson);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    fetchBook();
    setFilteredDataSource(books);
    setMasterDataSource(books);
    setLoading(false);
  }, []);

  const searchFilterFunction = (text, filter = 'title') => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemDataTitle = item
          ? item[filter].toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemDataTitle.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  // const updateQuery = input => {
  //   setQuery(input);
  //   console.log(query);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        round
        searchIcon={{size: 35}}
        style={styles.textInput}
        onChangeText={text => searchFilterFunction(text)}
        onClear={text => searchFilterFunction('')}
        placeholder="Type Here..."
        value={search}
        color="black"
      />
      <FlatList
        refreshing={loading}
        // onRefresh={() => fetchBook()}
        data={filteredDataSource}
        extraData={query}
        ItemSeparatorComponent={ItemSeparatorView}
        keyExtractor={(index, item) => item.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.book}
            onPress={() => navigation.navigate('Book', {item})}>
            <Image
              style={styles.bookImage}
              source={{uri: item.book_image}}></Image>
            <View style={styles.details}>
              <Text style={styles.bookTitleText}>{item.title}</Text>

              <Text style={styles.bookAuthor}>{item.author}</Text>
              <Text style={styles.bookGenre}>
                <Text>Genul: </Text>
                {item.genre_id}
              </Text>
            </View>
          </TouchableOpacity>
        )}></FlatList>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  book: {
    flex: 1,
    flexDirection: 'row',
    padding: 1,
    backgroundColor: 'white',
  },
  bookImage: {
    width: 100,
    height: 100,
    margin: 5,
  },
  details: {
    flex: 1,
    flexDirection: 'column',
  },
  bookTitleText: {
    color: '#8B0000',
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  bookGenre: {
    fontSize: 12,
    color: 'black',
  },
  bookAuthor: {
    color: '#F41313',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 20,
  },
  searchIcon: {
    position: 'absolute',
    marginTop: '5%',
    marginLeft: '1.5%',
  },
  separatorView: {
    marginTop: '5%',
  },
});
