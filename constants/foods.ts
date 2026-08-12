export interface FoodItem {
  id: number | string;
  name: string;
  enName: string;
  allergen?: string;
  enAllergen?: string;
}

export interface FoodCategory {
  id: string;
  titleZh: string;
  titleEn: string;
  color: string;
  items: FoodItem[];
}

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 'fruits',
    titleZh: '水果类',
    titleEn: 'Fruits',
    color: '#FEE2E2',
    items: [
      { id: 1, name: '牛油果', enName: 'Avocado' },
      { id: 2, name: '香蕉', enName: 'Banana' },
      { id: 3, name: '蓝莓', enName: 'Blueberry' },
      { id: 4, name: '哈密瓜', enName: 'Cantaloupe' },
      { id: 5, name: '樱桃(去核)', enName: 'Cherry (pitted)' },
      { id: 6, name: '小蜜橘', enName: 'Clementine' },
      { id: 7, name: '无糖椰子', enName: 'Coconut (unsweetened)', allergen: '坚果', enAllergen: 'Tree Nuts' },
      { id: 8, name: '蔓越莓', enName: 'Cranberry' },
      { id: 9, name: '椰枣(去核)', enName: 'Date (pitted)' },
      { id: 10, name: '无花果', enName: 'Fig' },
      { id: 11, name: '葡萄(切半)', enName: 'Grape (halved)' },
      { id: 12, name: '西柚', enName: 'Grapefruit' },
      { id: 13, name: '番石榴', enName: 'Guava' },
      { id: 14, name: '蜜瓜', enName: 'Honeydew' },
      { id: 15, name: '猕猴桃', enName: 'Kiwi' },
      { id: 16, name: '芒果', enName: 'Mango' },
      { id: 17, name: '油桃', enName: 'Nectarine' },
      { id: 18, name: '橙子', enName: 'Orange' },
      { id: 19, name: '木瓜', enName: 'Papaya' },
      { id: 20, name: '桃子', enName: 'Peach' },
      { id: 101, name: '苹果', enName: 'Apple' },
      { id: 102, name: '梨', enName: 'Pear' },
      { id: 103, name: '李子', enName: 'Plum' },
      { id: 104, name: '草莓', enName: 'Strawberry' },
    ]
  },
  {
    id: 'vegetables',
    titleZh: '蔬菜类',
    titleEn: 'Vegetables',
    color: '#DCFCE7',
    items: [
      { id: 21, name: '芦笋', enName: 'Asparagus' },
      { id: 23, name: '甜菜', enName: 'Beets' },
      { id: 24, name: '西兰花', enName: 'Broccoli' },
      { id: 25, name: '胡桃南瓜', enName: 'Butternut Squash' },
      { id: 26, name: '胡萝卜', enName: 'Carrot' },
      { id: 27, name: '花菜', enName: 'Cauliflower' },
      { id: 28, name: '黄瓜', enName: 'Cucumber' },
      { id: 29, name: '四季豆', enName: 'Green Beans' },
      { id: 30, name: '羽衣甘蓝', enName: 'Kale' },
      { id: 31, name: '豌豆', enName: 'Peas' },
      { id: 32, name: '土豆', enName: 'Potato' },
      { id: 33, name: '南瓜', enName: 'Pumpkin' },
      { id: 34, name: '菠菜', enName: 'Spinach' },
      { id: 35, name: '红薯', enName: 'Sweet Potato' },
      { id: 36, name: '番茄(熟)', enName: 'Tomato (cooked)' },
      { id: 37, name: '西葫芦', enName: 'Zucchini' },
      { id: 38, name: '甜椒', enName: 'Bell Pepper' },
      { id: 39, name: '玉米', enName: 'Corn' },
      { id: 40, name: '毛豆', enName: 'Edamame', allergen: '大豆', enAllergen: 'Soy' },
      { id: 105, name: '白菜', enName: 'Cabbage' },
      { id: 106, name: '青菜/油菜', enName: 'Bok Choy' },
      { id: 107, name: '萝卜', enName: 'Radish' },
    ]
  },
  {
    id: 'grains',
    titleZh: '谷物与淀粉',
    titleEn: 'Grains & Starches',
    color: '#FEF9C3',
    items: [
      { id: 41, name: '燕麦片', enName: 'Oatmeal' },
      { id: 42, name: '糙米', enName: 'Brown Rice' },
      { id: 43, name: '藜麦', enName: 'Quinoa' },
      { id: 44, name: '大麦', enName: 'Barley' },
      { id: 45, name: '小米', enName: 'Millet' },
      { id: 46, name: '苋菜籽', enName: 'Amaranth' },
      { id: 47, name: '荞麦', enName: 'Buckwheat' },
      { id: 48, name: '全麦面包', enName: 'Whole Wheat Bread', allergen: '小麦', enAllergen: 'Wheat' },
      { id: 49, name: '全麦意面', enName: 'Whole Wheat Pasta', allergen: '小麦', enAllergen: 'Wheat' },
      { id: 50, name: '古斯米(北非小米)', enName: 'Couscous', allergen: '小麦', enAllergen: 'Wheat' },
      { id: 51, name: '玉米粥', enName: 'Polenta (Cornmeal)' },
      { id: 52, name: '白米饭', enName: 'Rice (White)' },
      { id: 53, name: '米饼', enName: 'Rice Cakes' },
      { id: 54, name: '酸面团面包', enName: 'Sourdough Bread', allergen: '小麦', enAllergen: 'Wheat' },
      { id: 55, name: '法罗小麦', enName: 'Farro', allergen: '小麦', enAllergen: 'Wheat' },
      { id: 56, name: '斯佩耳特小麦', enName: 'Spelt', allergen: '小麦', enAllergen: 'Wheat' },
      { id: 57, name: '画眉草籽', enName: 'Teff' },
      { id: 58, name: '全麦玉米饼', enName: 'Tortilla (Whole Wheat)', allergen: '小麦', enAllergen: 'Wheat' },
      { id: 59, name: '玉米烙饼', enName: 'Corn Tortilla' },
      { id: 60, name: '麦糊', enName: 'Cream of Wheat', allergen: '小麦', enAllergen: 'Wheat' },
      { id: 108, name: '大米', enName: 'Rice' },
    ]
  },
  {
    id: 'proteins',
    titleZh: '蛋白质',
    titleEn: 'Proteins',
    color: '#E0E7FF',
    items: [
      { id: 61, name: '鸡肉', enName: 'Chicken' },
      { id: 62, name: '火鸡', enName: 'Turkey' },
      { id: 63, name: '牛肉', enName: 'Beef' },
      { id: 64, name: '羊肉', enName: 'Lamb' },
      { id: 65, name: '猪肉', enName: 'Pork' },
      { id: 66, name: '三文鱼', enName: 'Salmon', allergen: '鱼类', enAllergen: 'Fish' },
      { id: 67, name: '白鱼肉(鳕鱼等)', enName: 'White Fish (Cod, Tilapia)', allergen: '鱼类', enAllergen: 'Fish' },
      { id: 68, name: '金枪鱼', enName: 'Tuna', allergen: '鱼类', enAllergen: 'Fish' },
      { id: 69, name: '虾', enName: 'Shrimp', allergen: '甲壳类', enAllergen: 'Shellfish' },
      { id: 70, name: '蛋黄', enName: 'Egg Yolk', allergen: '鸡蛋', enAllergen: 'Egg' },
      { id: 71, name: '蛋清', enName: 'Egg White', allergen: '鸡蛋', enAllergen: 'Egg' },
      { id: 72, name: '豆腐', enName: 'Tofu', allergen: '大豆', enAllergen: 'Soy' },
      { id: 73, name: '天贝(丹贝)', enName: 'Tempeh', allergen: '大豆', enAllergen: 'Soy' },
      { id: 74, name: '扁豆', enName: 'Lentils', allergen: '大豆', enAllergen: 'Soy' },
      { id: 75, name: '鹰嘴豆', enName: 'Chickpeas', allergen: '大豆', enAllergen: 'Soy' },
    ]
  },
  {
    id: 'dairy',
    titleZh: '乳制品与替代',
    titleEn: 'Dairy & Alternatives',
    color: '#DBEAFE',
    items: [
      { id: 76, name: '全脂原味酸奶', enName: 'Yogurt (Plain, Whole Milk)', allergen: '乳制品', enAllergen: 'Dairy' },
      { id: 77, name: '茅屋奶酪', enName: 'Cottage Cheese', allergen: '乳制品', enAllergen: 'Dairy' },
      { id: 78, name: '碎奶酪', enName: 'Cheese (Shredded)', allergen: '乳制品', enAllergen: 'Dairy' },
      { id: 79, name: '开菲尔酸奶', enName: 'Kefir', allergen: '乳制品', enAllergen: 'Dairy' },
      { id: 80, name: '全脂牛奶', enName: 'Milk (Whole Milk)', allergen: '乳制品', enAllergen: 'Dairy' },
      { id: 81, name: '里科塔奶酪', enName: 'Ricotta Cheese', allergen: '乳制品', enAllergen: 'Dairy' },
      { id: 82, name: '羊奶酪', enName: 'Goat Cheese', allergen: '乳制品', enAllergen: 'Dairy' },
      { id: 83, name: '强化豆奶', enName: 'Soy Milk (Fortified)', allergen: '大豆', enAllergen: 'Soy' },
      { id: 84, name: '强化杏仁奶', enName: 'Almond Milk (Fortified)', allergen: '坚果', enAllergen: 'Tree Nuts' },
      { id: 85, name: '强化燕麦奶', enName: 'Oat Milk (Fortified)', allergen: '小麦', enAllergen: 'Wheat' },
    ]
  },
  {
    id: 'fats',
    titleZh: '健康油脂',
    titleEn: 'Healthy Fats & Oils',
    color: '#E0F2FE',
    items: [
      { id: 86, name: '橄榄油', enName: 'Olive Oil' },
      { id: 87, name: '牛油果油', enName: 'Avocado Oil' },
      { id: 88, name: '椰子油', enName: 'Coconut Oil' },
      { id: 89, name: '亚麻籽粉', enName: 'Flaxseed (Ground)' },
      { id: 90, name: '奇亚籽', enName: 'Chia Seeds' },
      { id: 91, name: '大麻籽', enName: 'Hemp Seeds' },
      { id: 92, name: '核桃酱', enName: 'Walnut (Butter)', allergen: '坚果', enAllergen: 'Tree Nuts' },
      { id: 93, name: '杏仁酱', enName: 'Almond (Butter)', allergen: '坚果', enAllergen: 'Tree Nuts' },
      { id: 94, name: '芝麻酱', enName: 'Tahini (Sesame)', allergen: '芝麻', enAllergen: 'Sesame' },
      { id: 95, name: '葵花籽酱', enName: 'Sunflower Seed (Butter)' },
    ]
  },
  {
    id: 'flavors',
    titleZh: '香草与香料',
    titleEn: 'Herbs, Spices & Flavors',
    color: '#FCE7F3',
    items: [
      { id: 96, name: '肉桂', enName: 'Cinnamon' },
      { id: 97, name: '罗勒', enName: 'Basil' },
      { id: 98, name: '牛至', enName: 'Oregano' },
      { id: 99, name: '大蒜(熟)', enName: 'Garlic (Cooked)' },
      { id: 100, name: '生姜', enName: 'Ginger' },
      { id: 109, name: '香菜', enName: 'Cilantro' },
      { id: 110, name: '葱', enName: 'Green Onion' },
    ]
  }
];
