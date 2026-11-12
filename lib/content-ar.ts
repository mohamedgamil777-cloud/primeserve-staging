// Arabic for content that is stored in English only (About page, FAQs, Privacy
// Policy, service lists, form validation). Keys are the English text exactly as
// stored. If the English is changed in the admin, that text shows in English
// until an Arabic line is added here.

const AR: Record<string, string> = {
  // Form validation
  "Email is invalid.": "البريد الإلكتروني غير صالح.",
  "First name is required": "الاسم الأول مطلوب",
  "First name must be 25 characters at most": "يجب ألا يزيد الاسم الأول عن 25 حرفًا",
  "First name must be at least 2 characters": "يجب ألا يقل الاسم الأول عن حرفين",
  "Last name is required": "اسم العائلة مطلوب",
  "Last name must be 25 characters at most": "يجب ألا يزيد اسم العائلة عن 25 حرفًا",
  "Last name must be at least 2 characters": "يجب ألا يقل اسم العائلة عن حرفين",
  "Password must be at least 6 characters": "يجب ألا تقل كلمة المرور عن 6 أحرف",
  "Password must be at least 8 characters": "يجب ألا تقل كلمة المرور عن 8 أحرف",
  "Password must contain at least 8 character(s)": "يجب ألا تقل كلمة المرور عن 8 أحرف",
  "Passwords don't match": "كلمتا المرور غير متطابقتين",
  "Phone number must be at least 6 characters": "يجب ألا يقل رقم الهاتف عن 6 أرقام",
  "Phone number must be at most 20 characters": "يجب ألا يزيد رقم الهاتف عن 20 رقمًا",
  "Phone number must contain only numbers and allowed characters (+, -, space, parentheses)": "يجب أن يحتوي رقم الهاتف على أرقام فقط والرموز المسموحة (+ و - والمسافة والأقواس)",
  "Please enter a valid email address": "يرجى إدخال بريد إلكتروني صحيح",
  "Please provide a custom reason": "يرجى كتابة السبب",
  "Please select a reason": "يرجى اختيار سبب",
  "Current password must be at least 6 characters": "يجب ألا تقل كلمة المرور الحالية عن 6 أحرف",
  "New password must be at least 8 characters": "يجب ألا تقل كلمة المرور الجديدة عن 8 أحرف",

  // About page
  "About Us": "من نحن",
  "Since 2024, weve been dedicated to providing exceptional products and outstanding customer service. Our journey began with a simple mission: to make quality shopping accessible, enjoyable, and meaningful for everyone.":
    "منذ عام 2024 ونحن ملتزمون بتقديم منتجات مميزة وخدمة عملاء استثنائية. بدأت رحلتنا بمهمة بسيطة: أن نجعل الحصول على المنتجات والخدمات عالية الجودة سهلًا وممتعًا ومفيدًا للجميع.",
  "At Primeserve, we aim to fulfill all corporate needs through a unified platform that combines variety, simplicity, and smart management — giving businesses an integrated experience that lets them focus on growth instead of daily operational distractions.":
    "في PrimeServe نسعى لتلبية جميع احتياجات الشركات من خلال منصة موحدة تجمع بين التنوع والبساطة والإدارة الذكية، لنمنح الشركات تجربة متكاملة تتيح لها التركيز على النمو بدلًا من الانشغال بتفاصيل التشغيل اليومية.",
  "To become the leading digital partner for businesses, transforming how companies access and manage essential supplies, services, and operational solutions — all in one intelligent, seamless ecosystem.":
    "أن نصبح الشريك الرقمي الرائد للشركات، ونغيّر طريقة حصولها على المستلزمات والخدمات والحلول التشغيلية الأساسية وإدارتها، من خلال منظومة واحدة ذكية ومتكاملة.",
  "Speed , Quality ,Efficiency , sustainability , Reliability , and Innovation, These values guide every decision we make and every interaction we have.":
    "السرعة والجودة والكفاءة والاستدامة والموثوقية والابتكار. هذه القيم توجّه كل قرار نتخذه وكل تعامل لنا مع عملائنا.",

  // FAQ categories
  "Account & Payment": "الحساب والدفع",
  "Technical Support": "الدعم الفني",
  "Products & Services": "المنتجات والخدمات",
  "Orders & Delivery": "الطلبات والتوصيل",
  "Returns": "الاسترجاع",

  // FAQs
  "How do I update my company account details?": "كيف أحدّث بيانات حساب شركتي؟",
  "Log in and open your Account page. From there you can update your contact details, branch addresses and preferences.":
    "سجّل الدخول وافتح صفحة حسابك. من هناك يمكنك تحديث بيانات التواصل وعناوين الفروع والتفضيلات.",
  "I forgot my password. How can I reset it?": "نسيت كلمة المرور. كيف أعيد تعيينها؟",
  "Click 'Forgot Password' on the login page and enter your email address. We will send you a link to reset your password. If you don't receive it within a few minutes, check your spam folder.":
    "اضغط على «نسيت كلمة المرور» في صفحة تسجيل الدخول وأدخل بريدك الإلكتروني، وسنرسل لك رابطًا لإعادة تعيين كلمة المرور. إذا لم يصلك خلال دقائق، تحقق من مجلد الرسائل غير المرغوب فيها.",
  "What payment methods do you accept?": "ما طرق الدفع المتاحة؟",
  "The available payment methods are shown at checkout. For company accounts and large orders, contact us to agree on the payment option that suits you.":
    "تظهر طرق الدفع المتاحة عند إتمام الطلب. لحسابات الشركات والطلبات الكبيرة، تواصل معنا للاتفاق على طريقة الدفع المناسبة لك.",
  "Do I need an account to place an order?": "هل أحتاج إلى حساب لتقديم طلب؟",
  "Yes. A company account lets you place and track orders, manage budgets, save your branch addresses and earn reward points.":
    "نعم. يتيح لك حساب الشركة تقديم الطلبات وتتبعها وإدارة الميزانيات وحفظ عناوين الفروع وكسب نقاط المكافآت.",
  "Can I change the delivery address after placing an order?": "هل يمكنني تغيير عنوان التوصيل بعد تقديم الطلب؟",
  "Yes, if the order has not left our warehouse yet. Contact us as soon as possible with your order number and the new address.":
    "نعم، إذا لم يغادر الطلب مخزننا بعد. تواصل معنا في أقرب وقت مع رقم الطلب والعنوان الجديد.",
  "Can I track my order?": "هل يمكنني تتبع طلبي؟",
  "Yes. Log in and open 'My Orders' in your account to see the status of every order.":
    "نعم. سجّل الدخول وافتح «طلباتي» في حسابك لمعرفة حالة كل طلب.",
  "How long does delivery take?": "كم يستغرق التوصيل؟",
  "Delivery time depends on the items, quantities and the locations of your branches. We confirm the expected delivery date when we confirm your order, and keep you updated until it arrives.":
    "يعتمد وقت التوصيل على المنتجات والكميات ومواقع فروعك. نؤكد لك موعد التوصيل المتوقع عند تأكيد الطلب، ونبقيك على اطلاع حتى وصوله.",
  "How much does delivery cost?": "كم تكلفة التوصيل؟",
  "Delivery cost depends on the order size and delivery location, and is shown at checkout before you confirm. For large or recurring orders, contact us for a custom quotation.":
    "تعتمد تكلفة التوصيل على حجم الطلب وموقع التوصيل، وتظهر عند إتمام الطلب قبل التأكيد. للطلبات الكبيرة أو المتكررة، تواصل معنا للحصول على عرض سعر خاص.",
  "Are your products original?": "هل منتجاتكم أصلية؟",
  "Yes. We work with trusted suppliers and authorized distributors. If you have a question about a specific product, contact us and we will help.":
    "نعم. نتعامل مع موردين موثوقين وموزعين معتمدين. إذا كان لديك سؤال عن منتج معين، تواصل معنا وسنساعدك.",
  "Do you offer services as well as supplies?": "هل تقدمون خدمات إلى جانب المستلزمات؟",
  "Yes. Besides corporate supplies, Primeserve offers maintenance, HR and recruitment support, workforce management, health and safety training, medical insurance, call center and software services. See the Services page or contact us.":
    "نعم. إلى جانب مستلزمات الشركات، تقدم PrimeServe خدمات الصيانة ودعم الموارد البشرية والتوظيف وإدارة القوى العاملة وتدريب الصحة والسلامة والتأمين الطبي ومراكز الاتصال والحلول البرمجية. تصفح صفحة الخدمات أو تواصل معنا.",
  "Can I get a quotation before ordering?": "هل يمكنني الحصول على عرض سعر قبل الطلب؟",
  "Yes. Send us the items and quantities you need through the Contact page and our team will prepare a quotation for your company.":
    "نعم. أرسل لنا المنتجات والكميات التي تحتاجها من خلال صفحة التواصل، وسيعد فريقنا عرض سعر لشركتك.",
  "Can I order in bulk for several branches?": "هل يمكنني الطلب بكميات كبيرة لعدة فروع؟",
  "Yes. Primeserve is built for companies. You can order large quantities, save the addresses of all your branches, and upload your order from an Excel sheet.":
    "نعم. صُممت PrimeServe للشركات، فيمكنك طلب كميات كبيرة وحفظ عناوين جميع فروعك ورفع طلبك من ملف Excel.",
  "Can I be notified when an out-of-stock item is available?": "هل يمكن إشعاري عند توفر منتج نفد من المخزون؟",
  "Yes. Click 'Notify Me' on any out-of-stock product and we will let you know as soon as it is back in stock. You can also add it to your wishlist.":
    "نعم. اضغط «أعلمني» على أي منتج غير متوفر وسنخبرك فور توفره مرة أخرى. يمكنك أيضًا إضافته إلى قائمة المفضلة.",
  "How long does a refund take?": "كم يستغرق استرداد المبلغ؟",
  "Once we receive and check the returned items, we process the refund and confirm it to you. The time it takes to reach you depends on the payment method used.":
    "بعد استلام المنتجات المرتجعة وفحصها، نعالج استرداد المبلغ ونؤكده لك. تعتمد مدة وصوله إليك على طريقة الدفع المستخدمة.",
  "Can I exchange an item?": "هل يمكنني استبدال منتج؟",
  "Yes. Contact us with your order number and the item you want to exchange, and we will arrange it.":
    "نعم. تواصل معنا مع رقم الطلب والمنتج الذي تريد استبداله، وسنرتب ذلك.",
  "How do I return an item?": "كيف أرجع منتجًا؟",
  "Contact us with your order number and the items you want to return. Our team will confirm the return and arrange the pickup.":
    "تواصل معنا مع رقم الطلب والمنتجات التي تريد إرجاعها، وسيؤكد فريقنا الإرجاع ويرتب الاستلام.",
  "What is your return policy?": "ما سياسة الاسترجاع لديكم؟",
  "You can return items that arrive damaged, faulty or different from what you ordered. Please report the issue to us as soon as possible after delivery. Contact us for the full return terms.":
    "يمكنك إرجاع المنتجات التي تصل تالفة أو معيبة أو مختلفة عما طلبته. يرجى إبلاغنا بالمشكلة في أقرب وقت بعد التوصيل، وتواصل معنا لمعرفة شروط الاسترجاع كاملة.",
  "I'm having trouble with the website. What should I do?": "أواجه مشكلة في الموقع. ماذا أفعل؟",
  "Try refreshing the page or using a different browser. If the problem continues, contact us through the Contact page and describe what happened.":
    "جرّب تحديث الصفحة أو استخدام متصفح آخر. إذا استمرت المشكلة، تواصل معنا من خلال صفحة التواصل واشرح ما حدث.",
  "How do I subscribe to your newsletter?": "كيف أشترك في النشرة الإخبارية؟",
  "Enter your email in the newsletter box at the bottom of any page to receive news about new products, services and offers.":
    "أدخل بريدك الإلكتروني في خانة النشرة الإخبارية أسفل أي صفحة لتصلك أخبار المنتجات والخدمات والعروض الجديدة.",
  "How do I unsubscribe from emails?": "كيف ألغي الاشتراك في الرسائل؟",
  "Click the 'Unsubscribe' link at the bottom of any email we send, or change your email preferences in your account settings.":
    "اضغط على رابط «إلغاء الاشتراك» أسفل أي رسالة نرسلها، أو غيّر تفضيلات البريد من إعدادات حسابك.",

  // Privacy policy
  "Your privacy is important to us. This policy explains how we handle your personal information. We believe in transparency about how we collect, use, and share information about you. This policy applies to all of our services and explains our practices regarding your personal data. By using our services, you agree to the collection and use of information in accordance with this policy.":
    "خصوصيتك مهمة لنا. توضح هذه السياسة كيف نتعامل مع معلوماتك الشخصية. نؤمن بالشفافية في طريقة جمع المعلومات الخاصة بك واستخدامها ومشاركتها. تنطبق هذه السياسة على جميع خدماتنا وتوضح ممارساتنا المتعلقة ببياناتك الشخصية. باستخدامك لخدماتنا، فإنك توافق على جمع المعلومات واستخدامها وفقًا لهذه السياسة.",
  "This Privacy Policy describes how we collect, use, and protect your personal information when you visit our website, use our services, or interact with us. We are committed to protecting your privacy and ensuring the security of your personal data.":
    "توضح سياسة الخصوصية هذه كيف نجمع معلوماتك الشخصية ونستخدمها ونحميها عند زيارتك لموقعنا أو استخدامك لخدماتنا أو تواصلك معنا. نحن ملتزمون بحماية خصوصيتك وضمان أمان بياناتك الشخصية.",
  "We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, shipping address, payment information, and communication preferences. We also automatically collect certain information about your device and how you interact with our website through cookies and similar technologies.":
    "نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب أو إجراء عملية شراء أو الاشتراك في النشرة الإخبارية أو التواصل معنا. وقد يشمل ذلك اسمك وبريدك الإلكتروني ورقم هاتفك وعنوان التوصيل وبيانات الدفع وتفضيلات التواصل. كما نجمع تلقائيًا بعض المعلومات عن جهازك وطريقة تفاعلك مع موقعنا من خلال ملفات تعريف الارتباط والتقنيات المشابهة.",
  "We use your information to provide our services, process transactions, communicate with you, improve our website and services, personalize your experience, send marketing communications (with your consent), comply with legal obligations, and protect against fraud and abuse. We may also use aggregated, non-personally identifiable information for analytics and business purposes.":
    "نستخدم معلوماتك لتقديم خدماتنا ومعالجة المعاملات والتواصل معك وتحسين موقعنا وخدماتنا وتخصيص تجربتك وإرسال الرسائل التسويقية (بموافقتك) والالتزام بالمتطلبات القانونية والحماية من الاحتيال وإساءة الاستخدام. وقد نستخدم أيضًا معلومات مجمّعة لا تحدد هويتك لأغراض التحليل والأعمال.",
  "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, secure servers, regular security assessments, and employee training on data protection. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.":
    "نطبّق إجراءات أمان تقنية وتنظيمية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. ويشمل ذلك تشفير البيانات الحساسة واستخدام خوادم آمنة وإجراء تقييمات أمنية دورية وتدريب الموظفين على حماية البيانات. ومع ذلك، لا توجد وسيلة نقل عبر الإنترنت آمنة بنسبة 100%، ولا يمكننا ضمان الأمان المطلق.",
  "We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, personalize content, and remember your preferences. You can control cookie settings through your browser, but disabling certain cookies may affect website functionality. We also use third-party analytics services to help us understand how our website is used.":
    "نستخدم ملفات تعريف الارتباط وتقنيات التتبع المشابهة لتحسين تجربة التصفح وتحليل زيارات الموقع وتخصيص المحتوى وتذكر تفضيلاتك. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من متصفحك، لكن تعطيل بعضها قد يؤثر على عمل الموقع. كما نستخدم خدمات تحليل من أطراف ثالثة لمساعدتنا على فهم طريقة استخدام موقعنا.",
  "We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We may share your information with trusted service providers who assist us in operating our website and conducting our business, such as payment processors, shipping companies, and email service providers. These parties are contractually obligated to protect your information and use it only for the purposes we specify.":
    "لا نبيع معلوماتك الشخصية أو نؤجرها أو نتاجر بها مع أطراف ثالثة لأغراضهم التسويقية. وقد نشارك معلوماتك مع مزودي خدمات موثوقين يساعدوننا في تشغيل موقعنا وإدارة أعمالنا، مثل مزودي خدمات الدفع وشركات الشحن ومزودي خدمات البريد الإلكتروني. وتلتزم هذه الأطراف تعاقديًا بحماية معلوماتك واستخدامها فقط للأغراض التي نحددها.",
  "If you have any questions about this privacy policy or your data, please contact us through our Contact page.":
    "إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه أو بياناتك، يرجى التواصل معنا من خلال صفحة التواصل.",
  "We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. The retention period may vary depending on the type of information and the purpose for which it was collected. When we no longer need your personal information, we will securely delete or anonymize it.":
    "نحتفظ بمعلوماتك الشخصية طوال المدة اللازمة لتقديم خدماتنا والالتزام بالمتطلبات القانونية وحل النزاعات وتنفيذ اتفاقياتنا. وقد تختلف مدة الاحتفاظ حسب نوع المعلومات والغرض من جمعها. وعندما لا نعود بحاجة إلى معلوماتك الشخصية، نحذفها أو نجعلها مجهولة الهوية بطريقة آمنة.",
  "Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we discover that we have collected personal information from a child under 13, we will take steps to delete that information promptly.":
    "خدماتنا غير موجهة للأطفال دون سن 13 عامًا، ولا نجمع عن قصد معلومات شخصية منهم. إذا كنت وليّ أمر وتعتقد أن طفلك قدّم لنا معلومات شخصية، يرجى التواصل معنا فورًا. وإذا اكتشفنا أننا جمعنا معلومات شخصية من طفل دون 13 عامًا، فسنتخذ خطوات لحذفها على الفور.",
  "Your information may be transferred to and processed in countries other than your own. These countries may have different data protection laws than your country. When we transfer your information internationally, we implement appropriate safeguards to protect your personal information in accordance with applicable privacy laws.":
    "قد تُنقل معلوماتك وتُعالج في دول غير دولتك، وقد تختلف قوانين حماية البيانات فيها عن قوانين دولتك. وعند نقل معلوماتك دوليًا، نطبّق ضمانات مناسبة لحمايتها وفقًا لقوانين الخصوصية المعمول بها.",
  "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the updated policy on our website and updating the 'Last Updated' date. We encourage you to review this policy periodically to stay informed about how we protect your information.":
    "قد نحدّث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في ممارساتنا أو التقنيات أو المتطلبات القانونية أو غيرها. وسنخطرك بأي تغييرات جوهرية بنشر السياسة المحدثة على موقعنا وتحديث تاريخ «آخر تحديث». ننصحك بمراجعة هذه السياسة دوريًا للبقاء على اطلاع بكيفية حماية معلوماتك.",

  // Service request budget and timeline options
  "ASAP": "في أقرب وقت",
  "Within 1 week": "خلال أسبوع",
  "Within 2 weeks": "خلال أسبوعين",
  "Within 1 month": "خلال شهر",
  "Within 3 months": "خلال 3 أشهر",
  "Flexible": "مرن",
  "Under EGP 1,000": "أقل من 1,000 ج.م",
  "EGP 1,000 - 5,000": "1,000 - 5,000 ج.م",
  "EGP 5,000 - 10,000": "5,000 - 10,000 ج.م",
  "EGP 10,000 - 25,000": "10,000 - 25,000 ج.م",
  "EGP 25,000 - 50,000": "25,000 - 50,000 ج.م",
  "Over EGP 50,000": "أكثر من 50,000 ج.م",
  "Not Sure": "غير متأكد",

  // Service types
  "installation": "تركيب",
  "maintenance": "صيانة",
  "repair": "إصلاح",

  // Service features, requirements and inclusions
  "Benefits Administration": "إدارة المزايا",
  "Best Market Offers: Access exclusive offers from top-tier Egyptian insurance companies.": "أفضل عروض السوق: احصل على عروض حصرية من كبرى شركات التأمين المصرية.",
  "Dedicated Support: Professional agents trained to represent your brand flawlessly.": "دعم مخصص: موظفون محترفون مدرَّبون على تمثيل علامتك التجارية بإتقان.",
  "Defining Competencies Selecting Tools": "تحديد الكفاءات واختيار الأدوات",
  "Defining Objectives": "تحديد الأهداف",
  "Delivering the Training": "تنفيذ التدريب",
  "Designing the Training Program": "تصميم البرنامج التدريبي",
  "Evaluating the Training": "تقييم التدريب",
  "Guaranteed Compliance: Stay up-to-date with all official governmental decrees.": "التزام مضمون: ابقَ على اطلاع بجميع القرارات الحكومية الرسمية.",
  "Guaranteed Quality: We prioritize the quality of coverage and network strength, not just the price.": "جودة مضمونة: نهتم بجودة التغطية وقوة الشبكة الطبية، وليس السعر فقط.",
  "Implementation": "التنفيذ",
  "Maintenance": "الصيانة",
  "Needs Assessment": "تقييم الاحتياجات",
  "Omnichannel Integration: Managing calls, emails, and chat for unified customer service.": "تكامل جميع القنوات: إدارة المكالمات والبريد الإلكتروني والمحادثات لخدمة عملاء موحدة.",
  "Operational Excellence: Promote best practices within your HR and legal frameworks.": "تميّز تشغيلي: تطبيق أفضل الممارسات في أطر الموارد البشرية والأطر القانونية لديك.",
  "Operational Simplicity: Streamlined booking and tracking for a hassle-free experience.": "سهولة التشغيل: حجز وتتبع مبسّطان لتجربة بلا متاعب.",
  "Payroll Processing Services": "خدمات معالجة الرواتب",
  "Providing feedback and Coaching": "تقديم الملاحظات والتوجيه",
  "Report Preparation": "إعداد التقارير",
  "Risk Mitigation: Actively avoid penalties and legal disputes.": "تقليل المخاطر: تجنّب الغرامات والنزاعات القانونية.",
  "Safety Security: Professional handling and secure transport for your valuable freight.": "السلامة والأمان: تعامل احترافي ونقل آمن لشحناتك القيّمة.",
  "Scalability: Easily handle peak volumes without compromising service quality.": "قابلية التوسع: التعامل بسهولة مع أوقات الذروة دون التأثير على جودة الخدمة.",
  "Tailored Solutions: Find a plan that perfectly meets your organizational needs and budget.": "حلول مخصصة: اختر الخطة التي تناسب احتياجات شركتك وميزانيتها.",
  "Timely Execution: Commitment to meeting critical delivery schedules.": "تنفيذ في الموعد: التزام بمواعيد التسليم المهمة.",

  // Additional service options
  "choose a platform, plan your site's structure and content": "اختيار المنصة وتخطيط هيكل الموقع ومحتواه",
  "Continuous Improvement": "التحسين المستمر",
  "Efficient data extraction and processing from web sources.": "استخراج البيانات ومعالجتها بكفاءة من مصادر الويب.",
  "Electricity": "الكهرباء",
  "Enhancing Employee Engagement": "تعزيز تفاعل الموظفين",
  "Incorporate cutting-edge AI technologies into your products.": "دمج أحدث تقنيات الذكاء الاصطناعي في منتجاتك.",
  "Instalation": "التركيب",
  "Labor Law Regulations Process": "إجراءات قوانين العمل",
  "Logistics": "الخدمات اللوجستية",
  "Manpower Outsourcing": "توفير العمالة",
  "Performance Management Service": "خدمة إدارة الأداء",
  "tailored to your business needs. From concept to launch, our expert team ensures seamless functionality, engaging design, and scalable performance":
    "مصممة حسب احتياجات عملك. من الفكرة حتى الإطلاق، يضمن فريقنا الخبير أداءً سلسًا وتصميمًا جذابًا وقابلية للتوسع",
  "Talent Acquisition": "استقطاب المواهب",
}

// Arabic messages that are hardcoded in validation, shown in English on /en
const EN: Record<string, string> = {
  "البريد الإلكتروني غير صالح": "Email is invalid",
  "لتغيير كلمة السر يجب توفير كلًا من كلمة السر القدمية و الجديدة": "To change your password, enter both the current and the new password",
  "يجب أن تتطابق كلمة السر مع تأكيد كلمة السر": "Passwords don't match",
  "يجب أن تكون كلمة السر بطول 8 أحرف على الأقل": "Password must be at least 8 characters",
}

const norm = (s: string) => s.replace(/\s+/g, " ").trim()
const AR_N: Record<string, string> = Object.fromEntries(Object.entries(AR).map(([k, v]) => [norm(k), v]))
const EN_N: Record<string, string> = Object.fromEntries(Object.entries(EN).map(([k, v]) => [norm(k), v]))

/** Returns the text in the page language when a translation is known, otherwise the original. */
export function localizeContent<T extends string | null | undefined>(text: T, locale: string): T {
  if (!text) return text
  const map = locale === "ar" ? AR_N : EN_N
  return (map[norm(text)] ?? text) as T
}
