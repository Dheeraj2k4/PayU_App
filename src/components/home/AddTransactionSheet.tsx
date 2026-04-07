import React, {
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { FontFamily, Typography } from '../../constants/typography';
import { PREDEFINED_CATEGORIES } from '../../constants/categories';
import { useTransactionContext } from '../../store';
import { todayISO } from '../../utils/date';
import { TransactionType } from '../../types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// -- Types ---------------------------------------------------------------------

type SheetMode = 'menu' | 'expense' | 'income' | 'subscription';

export interface AddTransactionSheetRef {
  open: (mode?: SheetMode) => void;
  close: () => void;
}

interface FormErrors {
  amount?: string;
  title?: string;
  subName?: string;
  subAmount?: string;
}

// -- Category icon map ---------------------------------------------------------

const CATEGORY_ICONS: Record<string, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  food: 'food-fork-drink',
  travel: 'airplane',
  shopping: 'shopping',
  health: 'pill',
  entertainment: 'movie-outline',
  bills: 'receipt',
  salary: 'cash',
  investment: 'trending-up',
  other: 'dots-horizontal',
};

// -- Animated press wrapper ----------------------------------------------------

function PressScale({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.95, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
      onPress={onPress}
    >
      <Animated.View style={[animStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
}

// -- Menu step -----------------------------------------------------------------

interface MenuProps {
  onSelect: (mode: SheetMode) => void;
  onClose: () => void;
}

const MENU_ITEMS: { mode: SheetMode; icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; label: string; sub: string; color: string }[] = [
  { mode: 'expense',      icon: 'arrow-down-circle-outline', label: 'Add Expense',      sub: 'Track your spending',       color: '#F87171' },
  { mode: 'income',       icon: 'arrow-up-circle-outline',   label: 'Add Income',       sub: 'Record earned money',       color: '#3BB9A1' },
  { mode: 'subscription', icon: 'repeat',                      label: 'Add Subscription', sub: 'Track recurring payments',  color: '#74B8EF' },
];

function MenuStep({ onSelect, onClose }: MenuProps) {
  return (
    <Animated.View entering={FadeIn.duration(220)} exiting={FadeOut.duration(150)}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>What would you like to add?</Text>
        <PressScale onPress={onClose}>
          <View style={styles.closeBox}>
            <MaterialCommunityIcons name="close" size={18} color={Colors.dark.textSecondary} />
          </View>
        </PressScale>
      </View>

      {/* Options */}
      <View style={styles.menuList}>
        {MENU_ITEMS.map((item) => (
          <PressScale key={item.mode} onPress={() => onSelect(item.mode)} style={styles.menuItem}>
            <View style={[styles.menuIconBox, { backgroundColor: `${item.color}20` }]}>
              <MaterialCommunityIcons name={item.icon} size={26} color={item.color} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.dark.textMuted} />
          </PressScale>
        ))}
      </View>
    </Animated.View>
  );
}

// -- Transaction form ----------------------------------------------------------

interface TxFormProps {
  mode: 'expense' | 'income';
  onBack: () => void;
  onClose: () => void;
}

function TransactionForm({ mode, onBack, onClose }: TxFormProps) {
  const { addTransaction } = useTransactionContext();
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(PREDEFINED_CATEGORIES[0].id);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);

  const accentColor = mode === 'income' ? Colors.income : Colors.expense;
  const accentColorFallback = mode === 'income' ? '#3BB9A1' : '#F87171';

  const handleSave = () => {
    setTouched(true);
    const parsed = parseFloat(amount.replace(/,/g, '.'));
    if (!amount.trim() || isNaN(parsed) || parsed <= 0) {
      setErrors({ amount: 'Enter a valid amount greater than 0' });
      return;
    }
    addTransaction({
      type: mode as TransactionType,
      amount: parsed,
      categoryId,
      date: todayISO(),
      note: note.trim(),
    });
    onClose();
  };

  return (
    <Animated.View entering={SlideInRight.duration(250)} exiting={SlideOutLeft.duration(200)}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <PressScale onPress={onBack}>
            <View style={styles.backBox}>
              <MaterialCommunityIcons name="arrow-left" size={18} color={Colors.dark.textSecondary} />
            </View>
          </PressScale>
          <Text style={styles.title}>{mode === 'income' ? 'Add Income' : 'Add Expense'}</Text>
        </View>
        <PressScale onPress={onClose}>
          <View style={styles.closeBox}>
            <MaterialCommunityIcons name="close" size={18} color={Colors.dark.textSecondary} />
          </View>
        </PressScale>
      </View>

      {/* Amount */}
      <View style={styles.amountWrap}>
        <Text style={[styles.currencySymbol, { color: accentColorFallback }]}>$</Text>
        <TextInput
          style={[styles.amountInput, { color: accentColorFallback }]}
          placeholder="0.00"
          placeholderTextColor={Colors.dark.textMuted}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={(v) => { setAmount(v); if (touched) setErrors((e) => ({ ...e, amount: undefined })); }}
          autoFocus
        />
      </View>
      {touched && errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}

      {/* Category */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {PREDEFINED_CATEGORIES.map((cat) => {
            const active = categoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, active && { borderColor: cat.color, backgroundColor: `${cat.color}22` }]}
                onPress={() => setCategoryId(cat.id)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={CATEGORY_ICONS[cat.id] ?? 'dots-horizontal'}
                  size={15}
                  color={active ? cat.color : Colors.dark.textSecondary}
                />
                <Text style={[styles.categoryText, active && { color: cat.color }]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Note */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder="Add a note..."
          placeholderTextColor={Colors.dark.textMuted}
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Save */}
      <PressScale onPress={handleSave} style={[styles.saveBtn, { backgroundColor: accentColorFallback }]}>
        <MaterialCommunityIcons name="check" size={18} color="#fff" />
        <Text style={styles.saveBtnText}>Save {mode === 'income' ? 'Income' : 'Expense'}</Text>
      </PressScale>

      <View style={{ height: 24 }} />
    </Animated.View>
  );
}

// -- Subscription form ---------------------------------------------------------

interface SubFormProps {
  onBack: () => void;
  onClose: () => void;
}

const BILLING_CYCLES = ['monthly', 'yearly', 'weekly'] as const;
type BillingCycle = typeof BILLING_CYCLES[number];

function SubscriptionForm({ onBack, onClose }: SubFormProps) {
  const { addTransaction } = useTransactionContext();
  const [subName, setSubName] = useState('');
  const [amount, setAmount] = useState('');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);

  const handleSave = () => {
    setTouched(true);
    const newErrors: FormErrors = {};
    if (!subName.trim()) newErrors.subName = 'Name is required';
    const parsed = parseFloat(amount.replace(/,/g, '.'));
    if (!amount.trim() || isNaN(parsed) || parsed <= 0) newErrors.subAmount = 'Enter a valid amount';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    addTransaction({
      type: 'expense',
      amount: parsed,
      categoryId: 'bills',
      date: todayISO(),
      note: subName.trim(),
      isRecurring: true,
      recurringFrequency: cycle,
    });
    onClose();
  };

  return (
    <Animated.View entering={SlideInRight.duration(250)} exiting={SlideOutLeft.duration(200)}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <PressScale onPress={onBack}>
            <View style={styles.backBox}>
              <MaterialCommunityIcons name="arrow-left" size={18} color={Colors.dark.textSecondary} />
            </View>
          </PressScale>
          <Text style={styles.title}>Add Subscription</Text>
        </View>
        <PressScale onPress={onClose}>
          <View style={styles.closeBox}>
            <MaterialCommunityIcons name="close" size={18} color={Colors.dark.textSecondary} />
          </View>
        </PressScale>
      </View>

      {/* Subscription name */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Subscription Name *</Text>
        <TextInput
          style={[styles.input, touched && errors.subName ? styles.inputError : null]}
          placeholder="e.g. Netflix, Spotify"
          placeholderTextColor={Colors.dark.textMuted}
          value={subName}
          onChangeText={(v) => { setSubName(v); if (touched) setErrors((e) => ({ ...e, subName: undefined })); }}
          autoFocus
        />
        {touched && errors.subName ? <Text style={styles.errorText}>{errors.subName}</Text> : null}
      </View>

      {/* Amount */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Amount *</Text>
        <View style={styles.amountRow}>
          <Text style={styles.currencySmall}>$</Text>
          <TextInput
            style={[styles.input, { flex: 1 }, touched && errors.subAmount ? styles.inputError : null]}
            placeholder="0.00"
            placeholderTextColor={Colors.dark.textMuted}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={(v) => { setAmount(v); if (touched) setErrors((e) => ({ ...e, subAmount: undefined })); }}
          />
        </View>
        {touched && errors.subAmount ? <Text style={styles.errorText}>{errors.subAmount}</Text> : null}
      </View>

      {/* Billing cycle */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Billing Cycle</Text>
        <View style={styles.cycleRow}>
          {BILLING_CYCLES.map((c) => {
            const active = cycle === c;
            return (
              <PressScale key={c} onPress={() => setCycle(c)} style={[styles.cycleChip, active && styles.cycleChipActive]}>
                <Text style={[styles.cycleText, active && styles.cycleTextActive]}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </Text>
              </PressScale>
            );
          })}
        </View>
      </View>

      {/* Save */}
      <PressScale onPress={handleSave} style={[styles.saveBtn, { backgroundColor: '#74B8EF' }]}>
        <MaterialCommunityIcons name="check" size={18} color="#fff" />
        <Text style={styles.saveBtnText}>Save Subscription</Text>
      </PressScale>

      <View style={{ height: 24 }} />
    </Animated.View>
  );
}

// -- Main sheet ----------------------------------------------------------------

const AddTransactionSheet = forwardRef<AddTransactionSheetRef>((_, ref) => {
  const sheetRef = useRef<BottomSheet>(null);
  const [mode, setMode] = useState<SheetMode>('menu');

  const menuSnapPoints = useMemo(() => ['42%'], []);
  const formSnapPoints = useMemo(() => ['85%'], []);
  const snapPoints = mode === 'menu' ? menuSnapPoints : formSnapPoints;

  useImperativeHandle(ref, () => ({
    open: (initialMode: SheetMode = 'menu') => {
      setMode(initialMode);
      sheetRef.current?.expand();
    },
    close: () => sheetRef.current?.close(),
  }));

  const handleClose = useCallback(() => {
    sheetRef.current?.close();
    setTimeout(() => setMode('menu'), 400);
  }, []);

  const handleSelect = useCallback((selectedMode: SheetMode) => {
    setMode(selectedMode);
    sheetRef.current?.snapToIndex(0);
  }, []);

  const handleBack = useCallback(() => {
    setMode('menu');
    sheetRef.current?.snapToIndex(0);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.6} />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handle}
      keyboardBehavior="extend"
      animateOnMount
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {mode === 'menu' && (
          <MenuStep onSelect={handleSelect} onClose={handleClose} />
        )}
        {(mode === 'expense' || mode === 'income') && (
          <TransactionForm mode={mode} onBack={handleBack} onClose={handleClose} />
        )}
        {mode === 'subscription' && (
          <SubscriptionForm onBack={handleBack} onClose={handleClose} />
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default AddTransactionSheet;

// -- Styles --------------------------------------------------------------------

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: Colors.dark.surfaceElevated,
  },
  handle: {
    backgroundColor: Colors.dark.textMuted,
    width: 36,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  title: {
    ...Typography.headingMedium,
    color: Colors.dark.textPrimary,
  },
  closeBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Menu
  menuList: {
    gap: 10,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  menuIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    gap: 2,
  },
  menuLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: Colors.dark.textPrimary,
  },
  menuSub: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },

  // Amount
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencySymbol: {
    fontFamily: FontFamily.bold,
    fontSize: 36,
    lineHeight: 44,
  },
  currencySmall: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: Colors.dark.textSecondary,
    lineHeight: 28,
  },
  amountInput: {
    fontFamily: FontFamily.bold,
    fontSize: 48,
    lineHeight: 58,
    flex: 1,
    padding: 0,
  },

  // Fields
  fieldWrap: {
    marginTop: 16,
    gap: 8,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  input: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.dark.textPrimary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  inputError: {
    borderColor: Colors.error,
  },
  noteInput: {
    height: 90,
    paddingTop: 14,
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.error,
    marginTop: 2,
  },

  // Category
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.surface,
  },
  categoryText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },

  // Billing cycle
  cycleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cycleChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  cycleChipActive: {
    backgroundColor: `${Colors.blue}22`,
    borderColor: Colors.blue,
  },
  cycleText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  cycleTextActive: {
    color: Colors.blue,
    fontFamily: FontFamily.semiBold,
  },

  // Save button
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 14,
    marginTop: 24,
  },
  saveBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
