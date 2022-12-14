import styles from './landing.module.css';

export default function Page() {
    return (
        <>
            <section className={styles.hero}>
                <p>if <b>truth</b> is <i>beauty</i></p>
                <p>and <u>mathematics</u> is the <b>ultimate truth</b></p>
                <p>
                    doesn&apos;t it stand to reason that <u>mathematics</u> should
                    be able to create the <i>ultimate beauty</i>?
                </p>
            </section>
            <p>
                Synthetic Beauty is a project that allows users to create and
                share programmatic music visualizers.
            </p>
        </>
    );
}
