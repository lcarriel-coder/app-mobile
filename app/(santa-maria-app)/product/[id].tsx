import { Product } from '@/core/products/interface/product.interface';
import { useProduct } from '@/presentation/products/hooks/useProduct';
import { ThemedView } from '@/presentation/theme/components/themed-view';

import ThemedButton from '@/presentation/theme/components/ui/ThemedButton';
import ThemedTextInput from '@/presentation/theme/components/ui/ThemedTextInput';
import { Redirect, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

const ProductScreen = () => {

  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { productQuery, productMutation } = useProduct(`${id}`);

  // ✅ Declarar el formulario ANTES de los returns condicionales
  const { control, handleSubmit, watch, reset, setValue } = useForm<Product>();

  useEffect(() => {
    if (productQuery.data) {
      // ✅ Cuando llega el producto, se actualiza el form
      reset(productQuery.data);
      navigation.setOptions({ title: productQuery.data.title });
    }
  }, [productQuery.data]);

  const onSubmit = (data: Product) => {
    productMutation.mutate(data);
  };

  // ✅ returns condicionales DESPUÉS de la declaración de hooks
  if (productQuery.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={30} />
      </View>
    );
  }

  if (!productQuery.data) {
    return <Redirect href="/(santa-maria-app)/(home)" />;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView>



       <ThemedView style={{ marginHorizontal: 10, marginTop: 20 }}>
          <Controller
            control={control}
            name="title"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Título del producto"
                style={{ marginVertical: 5 }}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="slug"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Slug"
                style={{ marginVertical: 5 }}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Descripción"
                multiline
                numberOfLines={5}
                style={{ marginVertical: 5 }}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </ThemedView>

        <ThemedView style={{ marginHorizontal: 10, marginVertical: 5, flexDirection: 'row', gap: 10 }}>
          <Controller
            control={control}
            name="price"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Precio"
                style={{ flex: 1 }}
                value={value?.toString()}
                onChangeText={(text) => onChange(text)}
                keyboardType="numeric"
              />
            )}
          />

          <Controller
            control={control}
            name="stock"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Inventario"
                style={{ flex: 1 }}
                value={value?.toString()}
                onChangeText={(text) => onChange(text)}
                keyboardType="numeric"
              />
            )}
          />
        </ThemedView>

 

        



          
        <View style={{ marginHorizontal: 10, marginBottom: 50, marginTop: 20 }}>
          <ThemedButton icon="save-outline" onPress={handleSubmit(onSubmit)}>
            Guardar
          </ThemedButton>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProductScreen;
