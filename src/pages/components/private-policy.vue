<template>
    <div class="privacy-policy" :class="{ 'lang-zh': isZh }">
        <!-- 语言切换控件 -->
        <div id="language-switcher">
            <button @click="setLang('en')">English</button>
            <button @click="setLang('zh')">中文</button>
        </div>

        <div class="container">
            <!-- 导航目录 -->
            <nav class="directory-info">
                <h2><i class="fas fa-list-ul"></i>
                    <span class="en">Directory</span>
                    <span class="zh">目录导航</span>
                </h2>
                <ul>
                    <li>
                        <a href="#Data_Collection">
                            <span class="en">Data Collection</span>
                            <span class="zh">数据收集</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Log_Information">
                            <span class="en">Log Information</span>
                            <span class="zh">日志信息</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Personal_Data">
                            <span class="en">Personal Data</span>
                            <span class="zh">个人数据</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Section4">
                            <span class="en">Valid Reasons for Processing Your Personal Data</span>
                            <span class="zh">数据处理依据</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Section5">
                            <span class="en">Acquisition and Usage of Information</span>
                            <span class="zh">信息使用方式</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Section6">
                            <span class="en">Safeguarding Your Personal Data</span>
                            <span class="zh">数据安全</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Section7">
                            <span class="en">Retention Period for Personal Data</span>
                            <span class="zh">数据保留</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Section8">
                            <span class="en">Children's Privacy</span>
                            <span class="zh">儿童隐私</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Section9">
                            <span class="en">Disclosure of Personal Data to Third Parties</span>
                            <span class="zh">第三方共享</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Section10">
                            <span class="en">International Transfers of Personal Data</span>
                            <span class="zh">国际传输</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Section11">
                            <span class="en">Your Rights and Managing Your Personal Data</span>
                            <span class="zh">用户权利</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Section12">
                            <span class="en">Cookie Usage</span>
                            <span class="zh">Cookie政策</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Section13">
                            <span class="en">Scope of Our Policy</span>
                            <span class="zh">适用范围</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Section14">
                            <span class="en">Modifications to This Policy</span>
                            <span class="zh">政策更新</span>
                        </a>
                    </li>
                    <li>
                        <a href="#Section15">
                            <span class="en">Contact Us</span>
                            <span class="zh">联系我们</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fas fa-arrow-up"></i>
                            <span class="en">Back to Top</span>
                            <span class="zh">返回顶部</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <!-- 主要内容区域 -->
            <main class="content-info">
                <h1 id="privacy-title">
                    <span class="en">Wing Dropship Privacy Policy</span>
                    <span class="zh">Wing Dropship 隐私政策</span>
                </h1>
                <div class="content" id="introduction">
                    <p class="en">
                        Wing Dropship takes your privacy seriously. This policy details how we collect, use, and protect
                        your personal information. Last updated: January 23, 2025.
                    </p>
                    <p class="zh">
                        Wing Dropship 高度重视您的隐私保护。本政策详细说明了我们如何收集、使用和保护您的个人信息。最后更新日期：2025年1月23日。
                    </p>
                </div>

                <!-- 各章节内容 -->
                <section>
                    <h2 id="Data_Collection">
                        <span class="en">Data Collection</span>
                        <span class="zh">数据收集</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            We collect information, which includes both the data you deliberately supply when using or
                            engaging in our services and promotions, and the data automatically transmitted by your
                            devices while accessing our products and services.
                        </p>
                        <p class="zh">
                            当您使用我们的服务或参与促销活动时，我们会收集您主动提供的信息，以及您在访问我们的产品和服务时由您的设备自动传输的数据。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 id="Log_Information">
                        <span class="en">Log Information</span>
                        <span class="zh">日志信息</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            When you access our website, our servers may automatically record standard data provided by
                            your web browser. This may consist of your device's Internet Protocol (IP) address, your
                            browser type and version, the pages you view, the time and date of your visit, the duration
                            spent on each page, additional details about your visit, and technical specifics that arise
                            alongside any errors you may experience.
                        </p>
                        <p class="en">
                            Please note that while this information may not be personally identifying on its own, it
                            could be possible to combine it with other data to personally identify individual users.
                        </p>
                        <p class="zh">
                            当您访问我们的网站时，我们的服务器可能会自动记录您浏览器提供的标准数据。这可能包括您设备的互联网协议（IP）地址、浏览器类型和版本、您查看的页面、访问的时间和日期、每个页面的停留时长、以及访问过程中的其他细节和与任何错误相关的技术信息。
                        </p>
                        <p class="zh">
                            请注意，尽管这些信息本身可能不具备个人身份识别性，但有可能将其与其他数据结合以识别个人身份。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 id="Personal_Data">
                        <span class="en">Personal Data</span>
                        <span class="zh">个人数据</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            We may request personal data, which could include one or more of the following:
                        </p>
                        <ul>
                            <li class="en">Name</li>
                            <li class="en">Email</li>
                            <li class="en">Phone number</li>
                            <li class="en">Billing address</li>
                        </ul>
                        <p class="zh">
                            我们可能会要求您提供个人数据，这可能包括以下一项或多项：
                        </p>
                        <ul>
                            <li class="zh">姓名</li>
                            <li class="zh">电子邮件</li>
                            <li class="zh">电话号码</li>
                            <li class="zh">账单地址</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 id="Section4">
                        <span class="en">Valid Reasons for Processing Your Personal Data</span>
                        <span class="zh">数据处理依据</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            We only collect and utilize your personal data when we have a valid reason for doing so. In
                            such cases, we only gather personal data that is reasonably necessary for delivering our
                            services to you.
                        </p>
                        <p class="zh">
                            我们仅在具有合法依据的情况下收集和使用您的个人数据。在这种情况下，我们只会收集为向您提供服务而合理必要的个人数据。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 id="Section5">
                        <span class="en">Acquisition and Usage of Information</span>
                        <span class="zh">信息使用方式</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            We may obtain personal data from you when you perform any of the following actions on our
                            website:
                        </p>
                        <ul>
                            <li class="en">Subscribe to receive updates from us via email or social media channels</li>
                            <li class="en">Access our content using a mobile device or web browser</li>
                            <li class="en">Reach out to us via email, social media, or other similar technologies</li>
                            <li class="en">Mention us on social media</li>
                        </ul>
                        <p class="en">
                            We may gather, store, employ, and disclose information for specific purposes, ensuring that
                            personal data will not be further processed in a manner incompatible with these objectives:
                        </p>
                        <ul>
                            <li class="en">To enable customization or personalization of your experience on our website
                            </li>
                            <li class="en">To establish contact and communicate with you for analytics, market research,
                                and business growth, including operating and enhancing our website, associated
                                applications, and social media platforms</li>
                            <li class="en">For advertising and marketing purposes, including sending you promotional
                                material about our products and services, as well as information about third parties
                                that we believe may be of interest to you</li>
                            <li class="en">To facilitate your access to and usage of our website, related applications,
                                and social media platforms</li>
                        </ul>
                        <p class="en">
                            Please note that we may combine the information we collect about you with general
                            information or research data we receive from other reputable sources.
                        </p>
                        <p class="zh">
                            当您在我们的网站上执行以下任一操作时，我们可能会从您那里获取个人数据：
                        </p>
                        <ul>
                            <li class="zh">订阅我们的邮件或通过社交媒体渠道接收更新信息</li>
                            <li class="zh">通过移动设备或网页浏览器访问我们的内容</li>
                            <li class="zh">通过电子邮件、社交媒体或其他类似技术与我们联系</li>
                            <li class="zh">在社交媒体上提及我们</li>
                        </ul>
                        <p class="zh">
                            我们可能会为特定目的收集、存储、使用和披露信息，确保个人数据不会以与这些目标不相符的方式进一步处理：
                        </p>
                        <ul>
                            <li class="zh">以便为您在我们网站上的体验提供定制或个性化服务</li>
                            <li class="zh">建立联系并与您沟通，用于分析、市场调研和业务增长，包括运营和改进我们的网站、相关应用程序及社交媒体平台</li>
                            <li class="zh">用于广告和营销目的，包括向您发送有关我们产品和服务的促销材料，以及我们认为您可能感兴趣的第三方信息</li>
                            <li class="zh">以便促进您对我们的网站、相关应用程序及社交媒体平台的访问和使用</li>
                        </ul>
                        <p class="zh">
                            请注意，我们可能会将收集到的关于您的信息与我们从其他可信来源获得的常规信息或研究数据结合起来。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 id="Section6">
                        <span class="en">Safeguarding Your Personal Data</span>
                        <span class="zh">数据安全</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            We take necessary steps to protect the personal data we collect and process, as well as
                            retain it using commercially acceptable methods to prevent loss, theft, unauthorized access,
                            disclosure, duplication, use, or modification.
                        </p>
                        <p class="en">
                            While we strive to protect the personal data you provide, please be aware that no method of
                            electronic transmission or storage is entirely secure, and absolute data security cannot be
                            guaranteed. In case of a data breach, we will comply with the applicable laws.
                        </p>
                        <p class="en">
                            You are responsible for choosing a password and ensuring the security of your information
                            within the scope of our services.
                        </p>
                        <p class="zh">
                            我们采取必要措施保护我们收集和处理的个人数据，并以商业上可接受的方法进行存储，以防止数据丢失、被盗、未经授权的访问、泄露、复制、使用或篡改。
                        </p>
                        <p class="zh">
                            尽管我们努力保护您提供的个人数据，但请注意，没有任何电子传输或存储方法是绝对安全的，绝对的数据安全无法得到保证。如果发生数据泄露，我们将遵守适用法律。
                        </p>
                        <p class="zh">
                            您有责任选择密码并在使用我们的服务时确保您的信息安全。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 id="Section7">
                        <span class="en">Retention Period for Personal Data</span>
                        <span class="zh">数据保留</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            We retain your personal data only as long as required. This duration may vary depending on
                            the purpose for which we are using your information, in accordance with this privacy notice.
                            If your personal data is no longer needed, we will either delete it or anonymize it by
                            removing all identifiable details.
                        </p>
                        <p class="en">
                            If necessary, we may keep your personal data for legal, accounting, or reporting
                            obligations, or for archiving purposes in the public interest, scientific, historical
                            research, or statistical purposes.
                        </p>
                        <p class="zh">
                            我们仅在必要的时间内保留您的个人数据。根据我们使用您信息的目的，这一期限可能会有所不同。如果您的个人数据不再需要，我们将删除或通过去除所有可识别细节对其进行匿名化处理。
                        </p>
                        <p class="zh">
                            如有必要，我们可能会出于法律、会计或报告义务，或出于公共利益、科学、历史研究或统计目的而保留您的个人数据。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 id="Section8">
                        <span class="en">Children's Privacy</span>
                        <span class="zh">儿童隐私</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            We do not target our products or services at children under the age of 13 and do not
                            knowingly collect personal data from them.
                        </p>
                        <p class="zh">
                            我们的产品或服务不针对13岁以下儿童，我们也不会故意收集儿童的个人数据。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 id="Section9">
                        <span class="en">Disclosure of Personal Data to Third Parties</span>
                        <span class="zh">第三方共享</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            We may share personal data with:
                        </p>
                        <ul>
                            <li class="en">Our company's parent, subsidiary, or affiliate</li>
                            <li class="en">Third-party service providers, enabling them to offer their services, such as
                                IT service providers, data storage, hosting and server providers, advertisers, or
                                analytics platforms</li>
                            <li class="en">Our employees, contractors, and/or associated entities</li>
                            <li class="en">Existing or potential agents or business partners</li>
                            <li class="en">Sponsors or promoters of any contest, sweepstakes, or promotion we conduct
                            </li>
                            <li class="en">Courts, tribunals, regulatory authorities, and law enforcement officers, as
                                mandated by law, in connection with any ongoing or prospective legal proceedings, or to
                                establish, exercise, or defend our legal rights</li>
                            <li class="en">Third parties, including agents or subcontractors, who assist us in providing
                                information, products, services, or direct marketing to you</li>
                            <li class="en">Third parties for the collection and processing of data</li>
                        </ul>
                        <p class="zh">
                            我们可能会与以下各方共享个人数据：
                        </p>
                        <ul>
                            <li class="zh">我们公司的母公司、子公司或关联公司</li>
                            <li class="zh">第三方服务提供商，使其能够提供服务，例如 IT 服务提供商、数据存储、托管和服务器供应商、广告商或分析平台</li>
                            <li class="zh">我们的员工、承包商和/或相关实体</li>
                            <li class="zh">现有或潜在的代理或商业合作伙伴</li>
                            <li class="zh">我们举办的任何比赛、抽奖或促销活动的赞助商或推广者</li>
                            <li class="zh">根据法律规定，与正在进行或预期的法律诉讼有关，或为了确立、行使或捍卫我们的法律权利，而与法院、仲裁机构、监管机构和执法人员共享</li>
                            <li class="zh">协助我们向您提供信息、产品、服务或直邮营销的第三方，包括代理或分包商</li>
                            <li class="zh">用于数据收集和处理的第三方</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 id="Section10">
                        <span class="en">International Transfers of Personal Data</span>
                        <span class="zh">国际传输</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            We store and/or process the personal data we collect in locations where our partners,
                            affiliates, and third-party providers maintain facilities. Be aware that these locations may
                            not have the same data protection laws as the country where you initially provided the
                            information. If we transfer your personal data to third parties in other countries: (i) we
                            will perform those transfers following the requirements of applicable law; and (ii) we will
                            protect the transferred personal data according to this privacy notice.
                        </p>
                        <p class="zh">
                            我们在合作伙伴、关联公司和第三方供应商设有设施的地点存储和/或处理我们收集的个人数据。请注意，这些地点可能没有您最初提供信息的国家所具备的数据保护法律。如果我们将您的个人数据转移到其他国家的第三方：(i)
                            我们将根据适用法律的要求进行这些转移；(ii) 我们将按照本隐私声明的规定保护转移的个人数据。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 id="Section11">
                        <span class="en">Your Rights and Managing Your Personal Data</span>
                        <span class="zh">用户权利</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            You always have the right to withhold personal data from us, understanding that your
                            experience on our website may be affected. We will not discriminate against you for
                            exercising any of your rights regarding your personal data. If you do provide us with
                            personal data, we will collect, store, use, and disclose it following this privacy notice.
                            You have the right to request details of any personal data we hold about you.
                        </p>
                        <p class="en">
                            If we receive personal data about you from a third party, we will protect it as outlined in
                            this privacy notice. If you are a third party providing personal data about someone else,
                            you warrant that you have that person's consent to provide their personal data to us.
                        </p>
                        <p class="en">
                            If you previously agreed to let us use your personal data for direct marketing purposes, you
                            can change your mind at any time. We will provide you with the option to unsubscribe from
                            our email database or opt out of communications. Please note that we may need to request
                            specific information from you to help us confirm your identity.
                        </p>
                        <p class="en">
                            If you believe that any information we have about you is inaccurate, outdated, incomplete,
                            irrelevant, or misleading, please contact us using the details provided in this privacy
                            notice. We will take reasonable steps to correct any information found to be inaccurate,
                            incomplete, misleading, or outdated.
                        </p>
                        <p class="en">
                            If you believe we have violated a relevant data protection law and wish to file a complaint,
                            please contact us using the details below and provide full details of the alleged breach. We
                            will promptly investigate your complaint and respond to you in writing, outlining the
                            outcome of our investigation and the steps we will take to address your complaint. You also
                            have the right to contact a regulatory body or data protection authority concerning your
                            complaint.
                        </p>
                        <p class="zh">
                            您始终有权拒绝向我们提供个人数据，但请注意，这可能会影响您在我们网站上的体验。对于您就个人数据所行使的任何权利，我们不会对您进行歧视。如果您向我们提供个人数据，我们将按照本隐私声明收集、存储、使用和披露这些数据。您有权要求我们提供我们所持有的关于您的任何个人数据的详细信息。
                        </p>
                        <p class="zh">
                            如果我们从第三方收到关于您的个人数据，我们将按照本隐私声明的规定对其进行保护。如果您作为第三方提供他人的个人数据，则您保证已获得该人的同意，方可向我们提供其个人数据。
                        </p>
                        <p class="zh">
                            如果您之前同意让我们将您的个人数据用于直接营销目的，您可以随时改变主意。我们将为您提供取消订阅我们的邮件数据库或选择不接收通讯的选项。请注意，我们可能需要向您请求特定信息以确认您的身份。
                        </p>
                        <p class="zh">
                            如果您认为我们持有的关于您的任何信息不准确、过时、不完整、不相关或具有误导性，请通过本隐私声明中提供的联系方式与我们联系。我们将采取合理措施纠正任何被发现不准确、不完整、误导或过时的信息。
                        </p>
                        <p class="zh">
                            如果您认为我们违反了相关数据保护法律并希望提出投诉，请通过下述联系方式与我们联系，并提供有关所称违规行为的完整详细信息。我们将迅速调查您的投诉，并以书面形式回复您，概述我们调查的结果及我们将采取的措施。您也有权联系监管机构或数据保护主管部门以处理您的投诉。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 id="Section12">
                        <span class="en">Cookie Usage</span>
                        <span class="zh">Cookie政策</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            We use “cookies” to gather information about you and your activity across our site. A cookie
                            is a small piece of data that our website stores on your computer and accesses each time you
                            visit, helping us understand how you use our site. This enables us to serve you content
                            based on your preferences.
                        </p>
                        <p class="zh">
                            我们使用“cookies”来收集关于您及您在我们网站上的活动的信息。Cookie是我们网站存储在您计算机上的一小段数据，每次您访问时都会被读取，从而帮助我们了解您如何使用网站，并根据您的偏好为您提供内容。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 id="Section13">
                        <span class="en">Scope of Our Policy</span>
                        <span class="zh">适用范围</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            Our website may contain links to external sites that we do not operate. Please be aware that
                            we have no control over the content and policies of those sites and cannot accept
                            responsibility or liability for their respective privacy practices.
                        </p>
                        <p class="zh">
                            我们的网站可能包含指向我们不运营的外部网站的链接。请注意，我们对这些网站的内容和政策不具控制权，也无法对其各自的隐私实践承担责任。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 id="Section14">
                        <span class="en">Modifications to This Policy</span>
                        <span class="zh">政策更新</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            At our discretion, we may modify our privacy policy to reflect updates to our business
                            processes, current acceptable practices, or legislative or regulatory changes. If we decide
                            to change this privacy policy, we will post the changes here at the same link through which
                            you are accessing this privacy policy.
                        </p>
                        <p class="en">
                            If required by law, we will obtain your permission or give you the opportunity to opt in or
                            opt out, as applicable, of any new uses of your personal data.
                        </p>
                        <p class="zh">
                            根据我们的判断，我们可能会修改隐私政策，以反映业务流程、当前可接受做法或立法及监管变化的更新。如果我们决定更改此隐私政策，我们将通过您访问此隐私政策的相同链接发布变更。
                        </p>
                        <p class="zh">
                            如法律要求，我们将征求您的同意或为您提供选择加入或退出任何新用途的机会。
                        </p>
                    </div>
                </section>

                <section>
                    <h2 id="Section15">
                        <span class="en">Contact Us</span>
                        <span class="zh">联系我们</span>
                    </h2>
                    <div class="content">
                        <p class="en">
                            For any questions or concerns about your privacy, please contact our Data Protection Officer
                            at: <i class="fas fa-envelope"></i>
                            <a href="mailto:support@wingdropship.com">support@wingdropship.com</a>
                        </p>
                        <p class="zh">
                            如对您的隐私有任何疑问或担忧，请联系我们的数据保护专员：<i class="fas fa-envelope"></i>
                            <a href="mailto:support@wingdropship.com">support@wingdropship.com</a>
                        </p>
                    </div>
                </section>
            </main>
        </div>

        <!-- 页脚 -->
        <footer class="footer-info">
            <div class="footer-content">
                <figure class="footer-img-container">
                    <img src="../../assets/logo-no-background.svg" alt="Wing Dropship" class="footer-img" />
                    <div class="logo-text">
                        Wing Dropship<span class="trademark">®</span>
                    </div>
                </figure>
                <div class="footer-text">
                    <span>© 2025 Wing Dropship. All rights reserved</span>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: "PrivacyPolicy",
    data() {
        return {
            isZh: false
        };
    },
    methods: {
        setLang(lang) {
            this.isZh = lang === "zh";
        }
    }
};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.privacy-policy {
    background: linear-gradient(90deg, #A67C52, #FFD700, #FF4500);
    ;
    color: #333;
    line-height: 1.6;
}

/* 中英文切换：默认显示英文 */
.zh {
    display: none !important;
}

/* 当 .lang-zh 类在根容器上时，显示中文，隐藏英文 */
.lang-zh .zh {
    display: inline !important;
}

.lang-zh .en {
    display: none !important;
}

/* 页面整体布局 */
.container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 60px 32px;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 48px;
    position: relative;
}

/* 语言切换按钮 */
#language-switcher {
    position: absolute;
    top: 20px;
    right: 32px;
}

#language-switcher button {
    background: none;
    border: 1px solid #A67C52;
    color: #f8f5f1;
    padding: 6px 12px;
    margin-left: 8px;
    border-radius: 4px;
    height: 35px;
    cursor: pointer;
    transition: background 0.2s;
}

#language-switcher button:hover {
    background: #A67C52;
    color: #fff;
}

/* 导航目录 */
.directory-info {
    position: sticky;
    top: 50px;
    align-self: start;
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--border-color);
}

.directory-info h2 {
    font-size: 18px;
    color: #A67C52;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 8px;
}

.directory-info ul {
    list-style: none;
}

.directory-info li {
    margin-bottom: 14px;
    font-size: 15px;
    position: relative;
    padding-left: 24px;
}

.directory-info li:before {
    content: "•";
    color: #FFD700;
    position: absolute;
    left: 0;
}

.directory-info li a span {
    display: inline-block;
}

/* 内容区域 */
.content-info {
    background: #fff;
    border-radius: 12px;
    padding: 48px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--border-color);
}

h1 {
    color: #A67C52;
    font-size: 32px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid var(--border-color);
}

h2 {
    color: #A67C52;
    font-size: 24px;
    margin: 32px 0 16px;
    padding-top: 24px;
}

.content {
    margin-bottom: 20px;
    font-size: 16px;
    color: #333;
}

.content p {
    margin-bottom: 12px;
}

.content ul {
    /* 使用默认的圆点项目符号 */
    list-style-type: disc !important;
    /* 设置左边距，给项目符号预留位置 */
    margin-left: 1.5em !important;
    padding-left: 0 !important;
}

/* 强制列表项始终显示为列表项 */
.content li {}

/* 保证中文的列表项显示为列表项，而不是 inline */
.lang-zh li.zh {
    display: list-item !important;
}

/* 页脚 */
.footer-info {
    background: #fff;
    padding: 40px 0;
    margin-top: 60px;
    position: relative;
}

.footer-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
}

.footer-img {
    height: 50px;
    width: 50px;
}

.footer-text {
    color: linear-gradient(90deg, #A67C52, #FFD700, #FF4500);
    font-size: 14px;
    display: flex;
    gap: 24px;
    align-items: center;
}

.footer-text a {
    color: #fff;
    opacity: 0.9;
}

.footer-text a:hover {
    opacity: 1;
    text-decoration: underline;
}

@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr;
        padding: 40px 16px;
    }

    .directory-info {
        position: static;
        margin-bottom: 32px;
    }

    .content-info {
        padding: 32px;
    }

    #language-switcher {
        position: static;
        text-align: right;
        margin-bottom: 16px;
    }

    .footer-content {
        flex-direction: column;
        gap: 24px;
        text-align: center;
    }
}

.footer-img-container {
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-text {

    background: linear-gradient(90deg, #A67C52, #FFD700, #FF4500);
    /* 渐变色 */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
}
</style>
