//Library import
import React from 'react';
import {ScrollView, View} from 'react-native';

// Local import
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import {styles} from '../../../themes';
import strings from '../../../i18n/strings';
import EText from '../../../components/common/EText';
import EHeader from '../../../components/common/EHeader';
import {privacyPolicyData} from '../../../api/constant';

export default PrivacyPolicy = () => {
  const RenderData = ({item}) => {
    return (
      <View style={styles.mt15}>
        <EText type={'b18'} style={styles.mb10}>
          {item.title}
        </EText>
        <EText type={'r16'} style={[styles.font16, styles.mb10]}>
          {item.description}
        </EText>
      </View>
    );
  };

  return (
    <ESafeAreaView>
      <EHeader title={strings.termsAndConditions} />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ph20}>
        {privacyPolicyData.map((item, index) => {
          return <RenderData item={item} key={index} />;
        })}
      </ScrollView>
    </ESafeAreaView>
  );
};
