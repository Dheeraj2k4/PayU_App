import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, ClipPath, Rect } from 'react-native-svg';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';

// ─── Built-in icons ───────────────────────────────────────────────────────────

export function CardLogoIcon() {
  return (
    <View style={styles.iconWrapper}>
      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.3334 7.01118C14.3467 6.3519 13.1867 6 12 6V0C14.3734 0 16.6934 0.703788 18.6668 2.02237C20.6402 3.34094 22.1783 5.21509 23.0866 7.40778C23.9948 9.60048 24.2324 12.0133 23.7694 14.3411C23.3064 16.6688 22.1635 18.8071 20.4853 20.4853C18.8071 22.1635 16.6688 23.3064 14.3411 23.7694C12.0133 24.2324 9.60048 23.9948 7.40778 23.0866C5.21509 22.1783 3.34094 20.6402 2.02237 18.6668C0.703788 16.6934 0 14.3734 0 12H6C6 13.1867 6.3519 14.3467 7.01118 15.3334C7.67046 16.3201 8.60754 17.0891 9.70392 17.5433C10.8002 17.9974 12.0067 18.1162 13.1705 17.8847C14.3344 17.6532 15.4035 17.0818 16.2427 16.2427C17.0818 15.4035 17.6532 14.3344 17.8847 13.1705C18.1162 12.0067 17.9974 10.8002 17.5433 9.70392C17.0891 8.60754 16.3201 7.67046 15.3334 7.01118Z"
          fill="white"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 2.59875e-06C6 0.787934 5.84481 1.56815 5.54328 2.2961C5.24175 3.02406 4.79979 3.68549 4.24264 4.24264C3.68549 4.7998 3.02406 5.24175 2.2961 5.54328C1.56814 5.84481 0.787929 6 2.62266e-07 6L0 12C1.57586 12 3.13629 11.6896 4.5922 11.0866C6.04812 10.4835 7.371 9.59958 8.48526 8.48526C9.59958 7.371 10.4835 6.04812 11.0866 4.5922C11.6896 3.13629 12 1.57586 12 0L6 2.59875e-06Z"
          fill="white"
        />
      </Svg>
    </View>
  );
}

export function StarSvgIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 16 16" fill="none">
      <ClipPath id="star_clip">
        <Rect width={15.9974} height={15.9974} fill="white" />
      </ClipPath>
      <Path
        d="M7.68206 1.52975C7.71127 1.47074 7.7564 1.42106 7.81234 1.38633C7.86829 1.3516 7.93283 1.33319 7.99868 1.33319C8.06453 1.33319 8.12907 1.3516 8.18501 1.38633C8.24096 1.42106 8.28608 1.47074 8.31529 1.52975L9.85504 4.64857C9.95647 4.85385 10.1062 5.03145 10.2914 5.16612C10.4766 5.3008 10.6917 5.38853 10.9182 5.42178L14.3616 5.9257C14.4269 5.93515 14.4882 5.96267 14.5386 6.00515C14.589 6.04763 14.6265 6.10337 14.6469 6.16606C14.6673 6.22876 14.6698 6.29591 14.654 6.35992C14.6382 6.42393 14.6048 6.48224 14.5576 6.52826L12.0673 8.9532C11.9031 9.11324 11.7802 9.31079 11.7093 9.52886C11.6383 9.74692 11.6215 9.97896 11.6601 10.205L12.248 13.6311C12.2595 13.6963 12.2525 13.7634 12.2276 13.8249C12.2028 13.8863 12.1613 13.9395 12.1077 13.9784C12.0541 14.0173 11.9907 14.0404 11.9246 14.045C11.8585 14.0496 11.7925 14.0355 11.7341 14.0044L8.6559 12.386C8.45308 12.2795 8.22743 12.2238 7.99834 12.2238C7.76926 12.2238 7.54361 12.2795 7.34079 12.386L4.26329 14.0044C4.20486 14.0353 4.13891 14.0492 4.07296 14.0445C4.00701 14.0398 3.94369 14.0167 3.89022 13.9779C3.83674 13.939 3.79526 13.8858 3.77048 13.8245C3.7457 13.7632 3.73862 13.6962 3.75004 13.6311L4.33728 10.2057C4.37607 9.97952 4.35927 9.74733 4.28831 9.52914C4.21736 9.31094 4.09439 9.11328 3.93001 8.9532L1.43976 6.52893C1.39216 6.48296 1.35843 6.42455 1.34242 6.36034C1.3264 6.29614 1.32873 6.22873 1.34916 6.16579C1.36958 6.10284 1.40727 6.04691 1.45794 6.00434C1.5086 5.96177 1.57021 5.93429 1.63573 5.92503L5.07849 5.42178C5.30529 5.38879 5.52068 5.30117 5.70611 5.16648C5.89154 5.03179 6.04147 4.85405 6.14298 4.64857L7.68206 1.52975Z"
        stroke="#A1A1A1"
        strokeWidth={1.33311}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExpenseItemData {
  id: string;
  category: string;
  subtitle: string;
  amount: string;
  starred?: boolean;
  /** 'default' = dark surface card | 'dark-gradient' = dark green gradient */
  variant?: 'default' | 'dark-gradient';
}

interface ExpenseItemProps extends ExpenseItemData {
  /** Custom left icon node. Defaults to CardLogoIcon. */
  icon?: ReactNode;
  /** Custom right-side content. Defaults to star button + amount badge. */
  rightContent?: ReactNode;
  onStarPress?: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExpenseItem({
  id,
  category,
  subtitle,
  amount,
  starred = false,
  variant = 'default',
  icon,
  rightContent,
  onStarPress,
}: ExpenseItemProps) {
  const defaultRight = (
    <>
      <TouchableOpacity
        onPress={() => onStarPress?.(id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.7}
      >
        <StarSvgIcon />
      </TouchableOpacity>
      <View style={styles.amountBadge}>
        <Text style={styles.amountText}>{amount}</Text>
      </View>
    </>
  );

  const content = (
    <View style={styles.inner}>
      {icon ?? <CardLogoIcon />}
      <View style={styles.info}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.right}>
        {rightContent ?? defaultRight}
      </View>
    </View>
  );

  if (variant === 'dark-gradient') {
    return (
      <LinearGradient
        colors={['#192D29', '#262626', '#0A0A0A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {content}
      </LinearGradient>
    );
  }

  return <View style={[styles.card, styles.defaultCard]}>{content}</View>;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  defaultCard: {
    backgroundColor: Colors.dark.surface,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  category: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.dark.textPrimary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.dark.textSecondary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountBadge: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  amountText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.dark.textPrimary,
  },
});
