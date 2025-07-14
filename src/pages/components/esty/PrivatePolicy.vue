<template>
    <div class="privacy-policy">
        <!-- Banner -->
        <div class="banner">
            <h1>Privacy Policy</h1>
            <p class="last-updated">Last Updated: March 10, 2025</p> <!-- Last updated date added as subtitle -->
        </div>

        <!-- Main Content Layout -->
        <div class="container">
            <!-- Left Sidebar: Table of Contents -->
            <div class="sidebar">
                <ul>
                    <li><a href="#information">Information We Collect</a></li>
                    <li><a href="#use">How We Use Information</a></li>
                    <li><a href="#share">How We Share Information</a></li>
                    <li><a href="#security">Security</a></li>
                    <li><a href="#retention">Data Retention</a></li>
                    <li><a href="#access">Access</a></li>
                    <li><a href="#rights">Your Data Protection Rights</a></li>
                    <li><a href="#children">Children's Privacy</a></li>
                    <li><a href="#changes">Changes to This Privacy Policy</a></li>
                    <li><a href="#international">International Data Transfers</a></li>
                </ul>
            </div>

            <!-- Right Content: Privacy Policy Sections -->
            <div class="content">
                <section id="information">
                    <h2>1. Information We Collect</h2>
                    <h3>Information You Provide</h3>
                    <ul>
                        <li class="emphasized">Account Registration: When you register for an Account with Continuserv,
                            we may ask for your contact information, including items such as name, company name,
                            address, email address, and telephone number. If you choose to refer a friend to our
                            Services, we may also collect your friend's email address.</li>
                        <li class="emphasized">Payment Information: When you add your financial account information,
                            that information is directed to our third-party payment processor. We do not store your
                            financial account information but may retain subscriber information through the processor.
                        </li>
                        <li class="emphasized">User Content: Our "Community" feature allows you to publicly post
                            content, which may be viewed by other users and third parties.</li>
                        <li class="emphasized">Communications: If you contact us, we may receive additional details such
                            as your name, email, phone number, and message content.</li>
                    </ul>

                    <h3>Information We Collect When You Use Our Services</h3>
                    <ul>
                        <li class="emphasized">Cookies and Tracking Technologies: We use cookies to collect information
                            such as IP addresses, browser type, ISP, operating system, and other browsing details.</li>
                        <li class="emphasized">Usage of Services: We collect information about your usage of our
                            Services, including system-level metrics and interaction data.</li>
                        <li class="emphasized">Third-Party Information: If you link third-party accounts, we may receive
                            authentication tokens and other account details.</li>
                    </ul>
                </section>

                <section id="use">
                    <h2>2. How We Use Information</h2>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul>
                        <li>Provide, operate, and maintain our Services</li>
                        <li>Improve, personalize, and expand our Services</li>
                        <li>Understand how you use our Services</li>
                        <li>Develop new products and features</li>
                        <li>Communicate with you for customer service and promotional purposes</li>
                        <li>Process transactions</li>
                        <li>Prevent fraud</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                </section>

                <section id="share">
                    <h2>3. How We Share Information</h2>
                    <ul>
                        <li>Vendors and Service Providers: We share information with third-party vendors who help
                            provide our Services.</li>
                        <li>Aggregate Information: We may share de-identified, aggregated information with partners.
                        </li>
                        <li>Professional Advisors: We may disclose information to professional advisors like lawyers or
                            auditors.</li>
                        <li>Analytics: We use third-party services such as Google Analytics and Mixpanel to analyze
                            usage data.</li>
                        <li>Business Transfers: In the event of a business transaction (e.g., merger), we may transfer
                            information.</li>
                        <li>As Required by Law: We may share information to comply with legal obligations or protect our
                            rights.</li>
                    </ul>
                </section>

                <section id="security">
                    <h2>4. Security</h2>
                    <p>
                        Continuserv is committed to protecting your information using various security measures to
                        prevent unauthorized access or disclosure. However, no internet method is 100% secure.
                    </p>
                </section>

                <section id="retention">
                    <h2>5. Data Retention</h2>
                    <p>
                        We retain personal information only as long as necessary to fulfill our business and legal
                        obligations. If no longer needed, we will delete or anonymize the data.
                    </p>
                </section>

                <section id="access">
                    <h2>6. Access</h2>
                    <p>
                        If you are a registered user, you can access, update, or delete your personal information by
                        logging into your account or contacting us.
                    </p>
                </section>

                <section id="rights">
                    <h2>7. Your Data Protection Rights</h2>
                    <p>
                        If you are a resident of the EEA, you have the right to access, correct, update, or request
                        deletion of your personal information. You may also opt-out of marketing communications.
                    </p>
                </section>

                <section id="children">
                    <h2>8. Children's Privacy</h2>
                    <p>
                        We do not knowingly collect information from children under the age of 13. If you believe a
                        child has provided personal information, please contact us.
                    </p>
                </section>

                <section id="changes">
                    <h2>9. Changes to This Privacy Policy</h2>
                    <p>
                        This Privacy Policy may be updated from time to time. Any changes will be posted on our
                        websites.
                    </p>
                </section>

                <section id="international">
                    <h2>10. International Data Transfers</h2>
                    <p>
                        We may transfer your personal information to other countries with different data protection
                        laws, and we ensure that your data is protected as per this Privacy Policy.
                    </p>
                </section>

                <section id="footer">
                    <div class="links">
                        <a href="/esty-collector-tos" target="_blank">Terms of Service</a>
                    </div>
                    <p>&copy; 2025 Continuserv.com, Powered by Continuserv</p>
                    <img class="cs_img" src="@/assets/png/cs.png" />
                </section>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PrivacyPolicy"
};
</script>

<style scoped>
/* Basic layout for the page */
.privacy-policy {
    font-family: RethinkSans-SemiBold, sans-serif;
}

.last-updated {
    font-size: 1rem;
    color: #ddd;
    margin-top: 10px;
}

/* Banner with gradient background */
.banner {
    background: linear-gradient(45deg, #658a61, #c556ad, #15a6fa, #ff7a00);
    color: white;
    text-align: left;
    padding: 30px;
    font-size: 1.3rem;
}

.banner h1 {
    margin: 0;
    font-size: 2rem;
}

/* Flex container for the content */
.container {
    display: flex;
    margin-top: 30px;
    padding: 20px;
}

/* Sidebar for table of contents */
.sidebar {
    width: 20%;
    padding-right: 20px;
}

.sidebar ul {
    list-style-type: disc;
    padding-left: 20px;
}

.sidebar li {
    margin: 10px 0;
}

.sidebar a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
}

/* Content area for privacy policy */
.content {
    width: 75%;
}

.content section {
    margin-bottom: 30px;
}

.content h2 {
    color: #333;
    margin-bottom: 10px;
}

.content h3 {
    color: #333;
    margin-top: 20px;
}

.content p {
    line-height: 1.6;
}

.emphasized {
    font-size: 1.1rem;
}

#footer {
    text-align: center;
    margin-top: 30px;
    color: #888;
}

.cs_img {
    width: 24px;
    height: 24px;
}

.links {
    margin-top: 20px;
}

.links a {
    margin: 0 10px;
    text-decoration: none;
    color: #4caf50;
}

.links a:hover {
    text-decoration: underline;
}
</style>
