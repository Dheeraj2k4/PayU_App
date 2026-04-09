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
import { getServiceIcon, BillsIcon } from '../common/ServiceIcons';
import { useTheme } from '../../hooks';

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
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <Animated.View entering={FadeIn.duration(220)} exiting={FadeOut.duration(150)}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>What would you like to add?</Text>
        <PressScale onPress={onClose}>
          <View style={styles.closeBox}>
            <MaterialCommunityIcons name="close" size={18} color={colors.textSecondary} />
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
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
          </PressScale>
        ))}
      </View>
    </Animated.View>
  );
}

// -- Date picker with inline calendar -----------------------------------------

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildCalendarGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

function pad(n: number) { return String(n).padStart(2, '0'); }

function DatePickerField({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const today = todayISO();
  const todayDate = new Date(today + 'T00:00:00');

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => new Date(value + 'T00:00:00').getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date(value + 'T00:00:00').getMonth());

  const grid = buildCalendarGrid(viewYear, viewMonth);

  const displayLabel = (() => {
    if (value === today) return 'Today';
    return new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  })();

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    const nextDate = new Date(viewYear, viewMonth + 1, 1);
    if (nextDate > todayDate) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function selectDay(day: number) {
    const selected = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
    if (selected > today) return;
    onChange(selected);
    setOpen(false);
  }

  const isNextMonthDisabled = (() => {
    const nextDate = new Date(viewYear, viewMonth + 1, 1);
    return nextDate > todayDate;
  })();

  return (
    <View>
      {/* Tappable date row */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen(o => !o)}
        style={styles.dateRow}
      >
        <MaterialCommunityIcons name="calendar-outline" size={18} color={colors.textSecondary} style={{ marginLeft: 14 }} />
        <Text style={styles.dateText}>{displayLabel}</Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.textSecondary}
          style={{ marginRight: 14 }}
        />
      </TouchableOpacity>

      {/* Inline calendar */}
      {open && (
        <View style={styles.calendarWrap}>
          {/* Month nav */}
          <View style={styles.calMonthRow}>
            <TouchableOpacity onPress={prevMonth} style={styles.calNavBtn}>
              <MaterialCommunityIcons name="chevron-left" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.calMonthLabel}>{monthLabel}</Text>
            <TouchableOpacity
              onPress={nextMonth}
              style={[styles.calNavBtn, isNextMonthDisabled && { opacity: 0.3 }]}
              disabled={isNextMonthDisabled}
            >
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Day-of-week headers */}
          <View style={styles.calDowRow}>
            {DAYS_OF_WEEK.map(d => (
              <Text key={d} style={styles.calDowText}>{d}</Text>
            ))}
          </View>

          {/* Day grid */}
          <View style={styles.calGrid}>
            {grid.map((day, i) => {
              if (day === null) return <View key={`e-${i}`} style={styles.calCell} />;
              const iso = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
              const isSelected = iso === value;
              const isFuture = iso > today;
              return (
                <TouchableOpacity
                  key={iso}
                  style={[styles.calCell, isFuture && { opacity: 0.25 }]}
                  onPress={() => selectDay(day)}
                  disabled={isFuture}
                  activeOpacity={0.7}
                >
                  <View style={[styles.calDayDot, isSelected && styles.calCellSelected]}>
                    <Text style={[styles.calDayText, isSelected && styles.calDayTextSelected]}>
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
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
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(PREDEFINED_CATEGORIES[0].id);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayISO);
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
      date,
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
              <MaterialCommunityIcons name="arrow-left" size={18} color={colors.textSecondary} />
            </View>
          </PressScale>
          <Text style={styles.title}>{mode === 'income' ? 'Add Income' : 'Add Expense'}</Text>
        </View>
        <PressScale onPress={onClose}>
          <View style={styles.closeBox}>
            <MaterialCommunityIcons name="close" size={18} color={colors.textSecondary} />
          </View>
        </PressScale>
      </View>

      {/* Amount */}
      <View style={styles.amountWrap}>
        <Text style={[styles.currencySymbol, { color: accentColorFallback }]}>$</Text>
        <TextInput
          style={[styles.amountInput, { color: accentColorFallback }]}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
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
                {cat.id === 'bills' ? (
                  <BillsIcon size={15} color={active ? cat.color : colors.textSecondary} />
                ) : (
                  <MaterialCommunityIcons
                    name={CATEGORY_ICONS[cat.id] ?? 'dots-horizontal'}
                    size={15}
                    color={active ? cat.color : colors.textSecondary}
                  />
                )}
                <Text style={[styles.categoryText, active && { color: cat.color }]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Date */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Date</Text>
        <DatePickerField value={date} onChange={setDate} />
      </View>

      {/* Note */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder="Add a note..."
          placeholderTextColor={colors.textMuted}
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

const SUBSCRIPTION_SERVICES = [
  { id: 'spotify',  label: 'Spotify',  color: '#1DB954' },
  { id: 'netflix',  label: 'Netflix',  color: '#E50914' },
  { id: 'youtube',  label: 'YouTube',  color: '#FF0000' },
  { id: 'google',   label: 'Google',   color: '#4285F4' },
] as const;
type ServiceId = typeof SUBSCRIPTION_SERVICES[number]['id'];

const BILLING_CYCLE_CONFIG = [
  { id: 'monthly', label: 'Monthly', icon: 'calendar-month-outline' as const },
  { id: 'yearly',  label: 'Yearly',  icon: 'calendar-blank-outline'  as const },
  { id: 'weekly',  label: 'Weekly',  icon: 'calendar-week-outline'   as const },
] as const;

function SubscriptionForm({ onBack, onClose }: SubFormProps) {
  const { addTransaction } = useTransactionContext();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [amount, setAmount] = useState('');
  const [serviceId, setServiceId] = useState<ServiceId>('spotify');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [date, setDate] = useState(todayISO);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);

  const activeService = SUBSCRIPTION_SERVICES.find((s) => s.id === serviceId)!;
  const accentColor = activeService.color;

  const handleSave = () => {
    setTouched(true);
    const parsed = parseFloat(amount.replace(/,/g, '.'));
    if (!amount.trim() || isNaN(parsed) || parsed <= 0) {
      setErrors({ amount: 'Enter a valid amount greater than 0' });
      return;
    }
    addTransaction({
      type: 'expense',
      amount: parsed,
      categoryId: 'bills',
      date,
      note: activeService.label,
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
              <MaterialCommunityIcons name="arrow-left" size={18} color={colors.textSecondary} />
            </View>
          </PressScale>
          <Text style={styles.title}>Add Subscription</Text>
        </View>
        <PressScale onPress={onClose}>
          <View style={styles.closeBox}>
            <MaterialCommunityIcons name="close" size={18} color={colors.textSecondary} />
          </View>
        </PressScale>
      </View>

      {/* Amount — same big input as expense/income */}
      <View style={styles.amountWrap}>
        <Text style={[styles.currencySymbol, { color: accentColor }]}>$</Text>
        <TextInput
          style={[styles.amountInput, { color: accentColor }]}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={(v) => { setAmount(v); if (touched) setErrors((e) => ({ ...e, amount: undefined })); }}
          autoFocus
        />
      </View>
      {touched && errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}

      {/* Service selector — category chip style */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Service</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {SUBSCRIPTION_SERVICES.map((svc) => {
            const active = serviceId === svc.id;
            const iconColor = active ? svc.color : colors.textSecondary;
            return (
              <TouchableOpacity
                key={svc.id}
                style={[styles.categoryChip, active && { borderColor: svc.color, backgroundColor: `${svc.color}22` }]}
                onPress={() => setServiceId(svc.id)}
                activeOpacity={0.8}
              >
                {getServiceIcon(svc.label, iconColor, 15)}
                <Text style={[styles.categoryText, active && { color: svc.color }]}>{svc.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Billing cycle — category chip style */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Billing Cycle</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {BILLING_CYCLE_CONFIG.map((c) => {
            const active = cycle === c.id;
            const chipColor = Colors.blue;
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.categoryChip, active && { borderColor: chipColor, backgroundColor: `${chipColor}22` }]}
                onPress={() => setCycle(c.id as BillingCycle)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={c.icon}
                  size={15}
                  color={active ? chipColor : colors.textSecondary}
                />
                <Text style={[styles.categoryText, active && { color: chipColor }]}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Date */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Date</Text>
        <DatePickerField value={date} onChange={setDate} />
      </View>

      {/* Save */}
      <PressScale onPress={handleSave} style={[styles.saveBtn, { backgroundColor: accentColor }]}>
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
  const { colors } = useTheme();
  const sheetStyles = makeStyles(colors);
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
      backgroundStyle={sheetStyles.sheetBackground}
      handleIndicatorStyle={sheetStyles.handle}
      keyboardBehavior="extend"
      animateOnMount
    >
      <BottomSheetScrollView
        contentContainerStyle={sheetStyles.container}
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

// -- Styles (theme-aware) -----------------------------------------------------

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    sheetBackground: {
      backgroundColor: colors.surfaceElevated,
    },
    handle: {
      backgroundColor: colors.textMuted,
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
      color: colors.textPrimary,
    },
    closeBox: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backBox: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
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
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.textPrimary,
    },
    menuSub: {
      fontFamily: FontFamily.regular,
      fontSize: 12,
      color: colors.textSecondary,
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
      color: colors.textSecondary,
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
      color: colors.textSecondary,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontFamily: FontFamily.regular,
      fontSize: 15,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
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
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    categoryText: {
      fontFamily: FontFamily.medium,
      fontSize: 13,
      color: colors.textSecondary,
    },

    // Billing cycle
    cycleRow: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 30,
      padding: 4,
    },
    cycleTab: {
      flex: 1,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 26,
    },
    cycleTabActive: {
      backgroundColor: Colors.blue,
    },
    cycleText: {
      fontFamily: FontFamily.medium,
      fontSize: 14,
      color: colors.textSecondary,
    },
    cycleTextActive: {
      color: '#FFFFFF',
      fontFamily: FontFamily.semiBold,
    },

    // Date picker
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 13,
    },
    dateText: {
      flex: 1,
      fontFamily: FontFamily.medium,
      fontSize: 14,
      color: colors.textPrimary,
    },
    calendarWrap: {
      marginTop: 8,
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
    },
    calMonthRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    calNavBtn: {
      padding: 6,
    },
    calMonthLabel: {
      fontFamily: FontFamily.semiBold,
      fontSize: 14,
      color: colors.textPrimary,
    },
    calDowRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    calDowText: {
      flex: 1,
      textAlign: 'center',
      fontFamily: FontFamily.medium,
      fontSize: 11,
      color: colors.textSecondary,
      paddingVertical: 4,
    },
    calGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    calCell: {
      width: `${100 / 7}%` as any,
      paddingVertical: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    calDayDot: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    calCellSelected: {
      backgroundColor: Colors.blue,
    },
    calDayText: {
      fontFamily: FontFamily.regular,
      fontSize: 13,
      color: colors.textPrimary,
    },
    calDayTextSelected: {
      fontFamily: FontFamily.semiBold,
      color: '#fff',
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
}
