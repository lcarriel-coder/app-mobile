import { Product, Size } from '@/core/products/interface/product.interface';
import { useProduct } from '@/presentation/products/hooks/useProduct';


import { ThemedView } from '@/presentation/theme/components/themed-view';
import ThemedButton from '@/presentation/theme/components/ui/ThemedButton';
import ThemedButtonGroup from '@/presentation/theme/components/ui/ThemedButtonGroup';
import ThemedTextInput from '@/presentation/theme/components/ui/ThemedTextInput';
import { Redirect, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

const ProductScreen = () => {
  
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { productQuery, productMutation } = useProduct(`${id}`);

  useEffect(() => {
    if (productQuery.data) {
      navigation.setOptions({ title: productQuery.data.title });
    }
  }, [productQuery.data]);

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

  const product: Product = productQuery.data;

  const { control, handleSubmit, watch, setValue } = useForm<Product>({
    defaultValues: product,
  });

  const values = watch();

  const onSubmit = (data: Product) => {
    productMutation.mutate(data);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView>
        {/* <ProductImages images={[...product.images, ...(values.selectedImages || [])]} /> */}

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
                value={value.toString()}
                onChangeText={(text) => onChange(Number(text))}
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
                value={value.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
        </ThemedView>

        <ThemedView style={{ marginHorizontal: 10 }}>
          <ThemedButtonGroup
            options={['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']}
            selectedOptions={values.sizes}
            onSelect={(selectedSize) => {
              const newSizesValue = values.sizes.includes(selectedSize as Size)
                ? values.sizes.filter((s) => s !== selectedSize)
                : [...values.sizes, selectedSize];
              //setValue('sizes', newSizesValue);
            }}
          />

          {/* <ThemedButtonGroup
            options={['kid', 'men', 'women', 'unisex']}
            selectedOptions={[values.gender]}
            onSelect={(selectedOption) => setValue('gender', selectedOption)}
          /> */}
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
