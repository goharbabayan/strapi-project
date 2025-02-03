import { forwardRef } from 'react';
import Text from '../text/Text';
import Rates from '../rates/Rates';
import { SERVICES_OPTIONS } from '@/app/utils/constants/userServices';
import { RATES_OPTIONS } from '@/app/utils/constants/ratesOptions';

const RatesAndServices = forwardRef(({
  memberFormData,
  incallRates,
  outcallRates,
  onChildFormDataChange,
  error},
  ref) => {

  return (
    <section
      id='Rates & Services'
      className='ratesAndServices section page-width'
      ref={ref}
    >
      <Text
        tag={'h2'}
        className='title'
        children={'Rates and Services'}
      />
      <Rates
        title={'Incall Rates'}
        type={'incall'}
        memberFormData={memberFormData}
        incallRates={incallRates}
        onChildFormDataChange={onChildFormDataChange}
        error={error?.incall}
        optionsList={RATES_OPTIONS}
      />
      <Rates
        title={'Outcall Rates'}
        type={'outcall'}
        memberFormData={memberFormData}
        outcallRates={outcallRates}
        onChildFormDataChange={onChildFormDataChange}
        error={error?.outcall}
        optionsList={RATES_OPTIONS}
      />
      {/* <Favourites
        label='Services*'
        labelClassName={'selectOptionLabel'}
        selectClassName={'select'}
        fieldClassName={'selectOptionsWrapper'}
        type='text'
        name='services'
        userOptions={memberFormData.services}
        onMouseDown={onChildFormDataChange}
        isRequired={true}
        optionsList={SERVICES_OPTIONS}
        errorMessage={error?.services}
      /> */}
    </section>
  )
});

export default RatesAndServices;
