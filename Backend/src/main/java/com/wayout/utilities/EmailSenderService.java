package com.wayout.utilities;

import com.wayout.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

@Component
public class EmailSenderService {

    public static final String REGISTRATION_MESSAGES = "Ciao! \nBenvenuto in WayOut!";
    private static final String ACCOUNT_DELETION = "Ciao, il tuo account è stato eliminato!\n";

    @Autowired
    public EmailSenderService(JavaMailSender sender) {
        mailSender = sender;
    }

    private static JavaMailSender mailSender;

    private static EmailSenderService senderService;

    public static void sendEmail(String toEmail, String subject, String body) throws MessagingException, UnsupportedEncodingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("hello@wayoutapp.it", "WayOut");
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(body);

        mailSender.send(message);
        System.out.println("Email inviata!");

    }


}
