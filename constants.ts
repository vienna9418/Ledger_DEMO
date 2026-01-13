
import { Transaction, TransactionType, Tag } from './types';

export const INITIAL_TAGS: Tag[] = [
  { id: '1', name: '美食', count: 24 },
  { id: '2', name: '团队', count: 12 },
  { id: '3', name: '工作', count: 18 },
  { id: '4', name: '收入', count: 8 },
  { id: '5', name: '交通', count: 15 },
  { id: '6', name: '健身', count: 5 },
  { id: '7', name: '日常', count: 32 },
  { id: '8', name: '娱乐', count: 21 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    type: TransactionType.EXPENSE,
    amount: 42.50,
    note: '和团队在那家新的意大利餐厅吃了个快餐。',
    tags: ['美食', '团队'],
    date: '2025年8月20日',
    time: '上午 10:45',
    location: '市中心',
    paymentMethod: '维萨卡 *4242'
  },
  {
    id: 't2',
    type: TransactionType.INCOME,
    amount: 2800.00,
    note: '每月工资入账。',
    tags: ['工作', '收入'],
    date: '2025年8月20日',
    time: '上午 09:00'
  },
  {
    id: 't3',
    type: TransactionType.NOTE,
    amount: 0,
    note: '记得明天检查云存储的订阅情况，或许可以降级套餐。',
    tags: ['提醒', '储蓄'],
    date: '2025年8月20日',
    time: '上午 08:15'
  },
  {
    id: 't4',
    type: TransactionType.EXPENSE,
    amount: 15.99,
    note: '数字流媒体服务月度续费。',
    tags: ['娱乐'],
    date: '2025年8月19日',
    time: '下午 06:30'
  }
];
