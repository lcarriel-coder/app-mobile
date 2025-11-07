import { Gender, Product, Size } from '@/core/products/interface/product.interface';
import ProductImages from '@/presentation/products/components/ProductImages';
import { useProduct } from '@/presentation/products/hooks/useProduct';
import { ThemedView } from '@/presentation/theme/components/themed-view';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import ThemedButton from '@/presentation/theme/components/ui/ThemedButton';
import ThemedButtonGroup from '@/presentation/theme/components/ui/ThemedButtonGroup';
import ThemedTextInput from '@/presentation/theme/components/ui/ThemedTextInput';
import { Redirect, useLocalSearchParams, useNavigation } from 'expo-router';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

const ProductScreen = () => {

  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { productQuery, productMutation } = useProduct(`${id}`);

  // ✅ Declaramos el formulario ANTES
  const { control, handleSubmit, watch, reset, setValue } = useForm<Product>({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      sizes: [],
      gender: Gender.Unisex,
      images: []
    },
  });

  // ✅ Cuando llega el producto, resetear el formulario
  useEffect(() => {
    if (productQuery.data) {
      reset(productQuery.data);
      navigation.setOptions({ title: productQuery.data.title });
    }
  }, [productQuery.data]);

 const onSubmit: SubmitHandler<Product> = (data) => {
  productMutation.mutate(data);
};

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

  // ✅ usar los valores del formulario, no los del producto directo
  const currentSizes = watch('sizes');
  const currentGender = watch('gender');
  const currentImages = watch('images');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView>

        {/* ✅ Las imágenes ahora toman las del formulario */}
        <ProductImages images={[...currentImages]} />

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
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
        </ThemedView>

        <ThemedView style={{ marginHorizontal: 10 }}>

          {/* ✅ Talllas conectadas con el watch */}
          <ThemedButtonGroup
            options={['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']}
            selectedOptions={currentSizes}
            onSelect={(selectedSize) => {
              const newSizesValue = currentSizes.includes(selectedSize as Size)
                ? currentSizes.filter((s) => s !== selectedSize)
                : [...currentSizes, selectedSize];

              setValue('sizes', newSizesValue as  Size[]);
            }}
          />

          {/* ✅ Género conectado con el watch */}
          <ThemedButtonGroup
            options={['kid', 'men', 'women', 'unisex']}
            selectedOptions={[currentGender]}
            onSelect={(selectedOption) =>setValue('gender', selectedOption as Gender )}
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
