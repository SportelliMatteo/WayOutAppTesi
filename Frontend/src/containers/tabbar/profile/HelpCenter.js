// Library import
import {ScrollView, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';

// Local import
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import {moderateScale} from '../../../common/constants';
import {Menu_Dark, Menu_Light} from '../../../assets/svgs';
import {styles} from '../../../themes';
import EText from '../../../components/common/EText';
import {
  helperData,
} from '../../../api/constant';
import FaqComponent from '../../../components/FaqComponent';

export default HelpCenter = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [isSelect, setIsSelect] = useState(0);

  const categoryData = [
    {
      id: 0,
      title: strings.faq,
      onPress: () => setIsSelect(0),
    },
  ];

  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    setFaqData(helperData);
  }, []);


  const RightIcon = useMemo(() => {
    return (
      <TouchableOpacity style={styles.pr10}>
        {colors.dark ? <Menu_Dark /> : <Menu_Light />}
      </TouchableOpacity>
    );
  }, []);

  const HeaderCategory = () => {
    return categoryData.map((item, index) => {
      return (
        <TouchableOpacity
          onPress={item.onPress}
          style={[
            localStyles.root,
            {
              borderBottomColor:
                isSelect === item.id ? colors.primary5 : colors.dark3,
            },
          ]}>
          <EText
            type={'s18'}
            align={'center'}
            style={styles.pb20}
            color={isSelect === item.id ? colors.primary5 : colors.grayScale7}>
            {item.title}
          </EText>
        </TouchableOpacity>
      );
    });
  };

  const RenderHelper = memo(({helperData}) => {
    return helperData.map((item, index) => {
      return <FaqComponent description={item.description} title={item.title} />;
    });
  });


  return (
    <ESafeAreaView
      style={{
        backgroundColor: colors.dark ? colors.backgroundColor : colors.white,
      }}>
      <EHeader title={strings.helpCenter} />
      <ScrollView
        bounces={false}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ph20}>
        <View style={localStyles.mainContainer}>
          <HeaderCategory />
        </View>
          <View>
            <View style={styles.mt15} />
              <RenderHelper helperData={faqData} />
          </View>
      </ScrollView>
    </ESafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.flexRow,
    width: '100%',
  },
  root: {
    borderBottomWidth: moderateScale(2),
    width: '100%',
  },
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  controlContainer: {
    ...styles.p15,
    ...styles.rowCenter,
    ...styles.ml10,
    ...styles.mt5,
    borderRadius: moderateScale(15),
  },
  contactUsContainer: {
    ...styles.mt20,
    ...styles.pv20,
    borderRadius: moderateScale(15),
    ...styles.flexRow,
    ...styles.contentCenter,
  },
});
