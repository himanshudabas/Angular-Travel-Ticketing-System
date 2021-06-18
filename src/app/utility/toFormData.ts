export function toFormData<T>( formValue: T ): FormData {
  const formData = new FormData();
  for ( const key of Object.keys(formValue) ) {
    const value = formValue[key];
    formData.append(key, value);
  }
  if (formData.get('comment') === null) {
    formData.set('comment', 'rest');
  }
  return formData;
}
