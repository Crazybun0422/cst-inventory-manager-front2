<template>
    <div class="terms-of-service">
        <!-- Banner -->
        <div class="banner">
            <h1>Terms of Service</h1>
            <p class="last-updated">Last Updated: March 10, 2025</p>
        </div>

        <!-- Main Content Layout -->
        <div class="container">
            <!-- Left Sidebar: Table of Contents -->
            <div class="sidebar">
                <ul>
                    <li><a href="#acceptance">Acceptance</a></li>
                    <li><a href="#ownership">Ownership</a></li>
                    <li><a href="#support">Support</a></li>
                    <li><a href="#payments">Payments & Refund Policy</a></li>
                    <li><a href="#emails">Transactional Emails</a></li>
                    <li><a href="#price-changes">Price Changes</a></li>
                    <li><a href="#data-sharing">Sharing of Data</a></li>
                    <li><a href="#privacy">Data Privacy</a></li>
                </ul>
            </div>

            <!-- Right Content: Terms -->
            <div class="content">
                <section id="acceptance">
                    <h2>1. Acceptance</h2>
                    <p>
                        By using or visiting our website and services, you signify that you have read, understand, and
                        agree to be bound by our "Terms of Service or Agreement".
                    </p>
                </section>

                <section id="ownership">
                    <h2>2. Ownership</h2>
                    <p>
                        You may not claim intellectual or exclusive ownership rights to any of our products. All
                        products are property of Continuserv.com. They are provided “as is” without warranty of any
                        kind, expressed or implied. We shall not be liable for any damages, including but not limited
                        to, direct, indirect, special, incidental, or consequential damages or losses that occur out of
                        the use or inability to use our products.
                    </p>
                </section>

                <section id="support">
                    <h2>3. Support</h2>
                    <p>
                        Support and automatic product updates are provided for the term defined by the account type and
                        are based on the date of purchase. After the subscription has expired a new subscription will
                        need to be purchased to continue receiving support and product updates.
                    </p>
                </section>

                <section id="payments">
                    <h2>4. Payments & Refund Policy</h2>
                    <p>
                        Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of
                        Record for all our orders. Paddle provides all customer service inquiries and handles returns.
                        We provide a 7-day money-back guarantee as part of their refund policy from the moment of
                        purchase. You can request money back if the service really doesn't satisfy you or you are faced
                        with some service issues. Please, email support[at]continuserv.com and send your order details.
                        We care about our services and customers. We want to ensure that you are happy with your
                        purchase and that our products work correctly in your website environment.
                    </p>
                    <h3>Money Back Guarantee</h3>
                    <p>
                        If you have any irresolvable issues getting one of our services to work or if you’re completely
                        unhappy with it, we will be happy to provide a full refund within 7 days* of the original
                        purchase.
                    </p>
                </section>

                <section id="emails">
                    <h2>5. Transactional Emails</h2>
                    <p>
                        Continuserv may on occasion send you email notifications related to your service. These
                        transactional emails may include notification of changes to our terms and conditions, license
                        expiration notices, and other transactional emails related to your purchase.
                    </p>
                </section>

                <section id="price-changes">
                    <h2>6. Price Changes</h2>
                    <p>
                        Continuserv reserves the right to change the price of any service at any time. Any price change
                        will be reflected on continuserv.com. If any price is lowered, you will not be entitled to a
                        refund for the difference in the price from the time you purchased the service.
                    </p>
                </section>

                <section id="data-sharing">
                    <h2>7. Sharing of Data</h2>
                    <p>
                        We will not share your data with any third parties under any circumstances.
                    </p>
                </section>

                <section id="privacy">
                    <h2>8. Data Privacy</h2>
                    <p>
                        Please refer to our Privacy Policy page.
                    </p>
                </section>

                <section id="footer">
                    <div class="links">
                        <a href="/esty-collector-pp" target="_blank">Private Policy</a>
                        <!-- <a href="https://www.continuserv.com" target="_blank">Visit Our Website</a> -->
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
    name: "TermsOfService"
};
</script>

<style scoped>
/* Basic layout for the page */


.terms-of-service {
    font-family: RethinkSans-SemiBold, sans-serif;
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


/* Banner with gradient background */
.banner {
    background: linear-gradient(45deg, #658a61, #c556ad, #15a6fa, #ff7a00);
    color: white;
    text-align: left;
    padding: 30px;
    font-size: 1.5rem;
}

.last-updated {
    font-size: 1rem;
    color: #ddd;
    margin-top: 10px;
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
    color: #333333;
    font-weight: bold;
}

/* Content area for terms */
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

.content p {
    line-height: 1.6;
}

.content h3 {
    margin-top: 10px;
    font-size: 1.2rem;
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
</style>
